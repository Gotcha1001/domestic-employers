"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  createUserProfile,
  getEmployerByClerkId,
  getWorkerByClerkId,
} from "@/actions/profiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationPicker from "@/components/LocationPicker";
import HouseLayoutEditor from "@/components/HouseLayoutEditor";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Room {
  type: string;
  instructions: string;
  position?: { x: number; y: number; width: number; height: number };
}

interface FormData {
  name: string;
  location: string;
  profileType: "employer" | "worker";
  image?: string;
  strengths?: string;
  availability?: string;
  rooms?: Room[];
}

export default function CreateProfile() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    location: "",
    profileType: "employer",
    strengths: "",
    availability: "",
    rooms: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingProfileType, setExistingProfileType] = useState<
    "employer" | "worker" | "pending" | null
  >(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    setFormData((prev) => ({
      ...prev,
      name: user.fullName || "",
      image: user.imageUrl || "",
    }));

    const fetchProfile = async () => {
      try {
        const [employer, worker] = await Promise.all([
          getEmployerByClerkId(user.id),
          getWorkerByClerkId(user.id),
        ]);

        if (employer) {
          const rooms = Array.isArray(employer.rooms)
            ? employer.rooms.filter(
                (room): room is Room =>
                  room &&
                  typeof room === "object" &&
                  "type" in room &&
                  "instructions" in room
              )
            : [];
          setFormData({
            name: employer.name,
            location: JSON.stringify({
              address: employer.address,
              coordinates: employer.coordinates,
            }),
            profileType: "employer",
            image: employer.image || "",
            rooms,
          });
          setExistingProfileType("employer");
        } else if (worker) {
          setFormData({
            name: worker.name,
            location: JSON.stringify({
              address: worker.address,
              coordinates: worker.coordinates,
            }),
            profileType: "worker",
            image: worker.image || "",
            strengths: worker.strengths || "",
            availability: worker.availability || "",
            rooms: [],
          });
          setExistingProfileType("worker");
        } else {
          setExistingProfileType("pending");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load existing profile.");
      }
    };

    fetchProfile();
  }, [user, isLoaded]);

  // Prevent creating a new profile if one exists
  useEffect(() => {
    if (
      existingProfileType &&
      existingProfileType !== "pending" &&
      formData.profileType !== existingProfileType
    ) {
      toast.error(
        `You already have a ${existingProfileType} profile. You can only edit your existing profile.`
      );
      router.push(`/view-profile/${user?.id}`);
    }
  }, [existingProfileType, formData.profileType, router, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB.");
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to create a profile.");
      return;
    }

    // Double-check existing profile type
    if (
      existingProfileType &&
      existingProfileType !== "pending" &&
      formData.profileType !== existingProfileType
    ) {
      toast.error(
        `You cannot create a ${formData.profileType} profile. You already have a ${existingProfileType} profile.`
      );
      return;
    }

    // Validate inputs
    if (!formData.name.trim() || formData.name.length > 100) {
      toast.error("Name must be between 1 and 100 characters.");
      return;
    }
    if (formData.profileType === "worker") {
      if (formData.strengths && formData.strengths.length > 500) {
        toast.error("Strengths must be less than 500 characters.");
        return;
      }
      if (formData.availability && formData.availability.length > 500) {
        toast.error("Availability must be less than 500 characters.");
        return;
      }
    }
    if (
      formData.profileType === "employer" &&
      (!formData.rooms || formData.rooms.length === 0)
    ) {
      toast.error(
        "At least one room with instructions is required for employer profiles."
      );
      return;
    }

    setLoading(true);
    try {
      let imageUrl = formData.image || "";
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: imageFormData,
        });
        if (!response.ok) {
          throw new Error(`Image upload failed: ${response.statusText}`);
        }
        const result = await response.json();
        if (!result.imageUrl || typeof result.imageUrl !== "string") {
          throw new Error("Invalid image URL from server");
        }
        imageUrl = result.imageUrl;
      }

      let parsedLocation;
      try {
        parsedLocation = JSON.parse(formData.location || "{}");
        if (!parsedLocation.address || !parsedLocation.coordinates) {
          throw new Error("Invalid location data");
        }
      } catch {
        toast.error("Please select a valid location.");
        setLoading(false);
        return;
      }

      const plainRooms =
        formData.rooms?.map((room) => ({
          type: room.type,
          instructions: room.instructions,
          position: room.position
            ? {
                x: Number(room.position.x),
                y: Number(room.position.y),
                width: Number(room.position.width),
                height: Number(room.position.height),
              }
            : undefined,
        })) || [];

      const submitData = {
        name: formData.name.trim(),
        location: JSON.stringify({
          address: parsedLocation.address,
          coordinates: {
            lat: Number(parsedLocation.coordinates.lat),
            lng: Number(parsedLocation.coordinates.lng),
          },
        }),
        profileType: formData.profileType,
        image: imageUrl || undefined,
        ...(formData.profileType === "employer" && { rooms: plainRooms }),
        ...(formData.profileType === "worker" && {
          strengths: formData.strengths?.trim(),
          availability: formData.availability?.trim(),
        }),
      };

      await createUserProfile(submitData);
      toast.success("Profile saved successfully!");
      router.push(`/view-profile/${user.id}`);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(
        `Failed to save profile: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-purple-800 to-indigo-800 text-white shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-100">
              {existingProfileType === "pending"
                ? "Create Profile"
                : "Edit Profile"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <label className="text-sm font-medium text-purple-200">
                  Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  required
                  maxLength={100}
                  className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <label className="text-sm font-medium text-purple-200">
                  Location
                </label>
                <LocationPicker
                  value={formData.location}
                  onChange={(location) =>
                    setFormData({ ...formData, location })
                  }
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <label className="text-sm font-medium text-purple-200">
                  Profile Type
                </label>
                <Select
                  value={formData.profileType}
                  onValueChange={(value: "employer" | "worker") =>
                    setFormData({
                      ...formData,
                      profileType: value,
                      rooms: value === "worker" ? [] : formData.rooms,
                    })
                  }
                  disabled={
                    existingProfileType !== null &&
                    existingProfileType !== "pending"
                  }
                >
                  <SelectTrigger
                    aria-label="Select profile type"
                    className="bg-purple-950/50 text-white border-purple-400 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <SelectValue placeholder="Select profile type" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-950 text-white border-purple-400">
                    <SelectItem value="employer">Employer</SelectItem>
                    <SelectItem value="worker">Worker</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <label className="text-sm font-medium text-purple-200">
                  Profile Image
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-purple-950/50 text-white border-purple-400 file:text-purple-200 file:bg-purple-700 file:border-0 file:rounded file:px-3 file:py-1 hover:file:bg-purple-600"
                />
              </motion.div>
              {formData.profileType === "worker" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <label className="text-sm font-medium text-purple-200">
                      Strengths
                    </label>
                    <Input
                      value={formData.strengths || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, strengths: e.target.value })
                      }
                      placeholder="Enter your strengths"
                      maxLength={500}
                      className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <label className="text-sm font-medium text-purple-200">
                      Availability
                    </label>
                    <Input
                      value={formData.availability || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availability: e.target.value,
                        })
                      }
                      placeholder="Enter your availability"
                      maxLength={500}
                      className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </motion.div>
                </>
              )}
              {formData.profileType === "employer" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                >
                  <label className="text-sm font-medium text-purple-200">
                    House Layout & Instructions
                  </label>
                  <HouseLayoutEditor
                    rooms={formData.rooms || []}
                    setRooms={(rooms) => setFormData({ ...formData, rooms })}
                  />
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
