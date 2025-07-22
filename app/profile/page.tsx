// "use client";

// import { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import {
//   createUserProfile,
//   getEmployerByClerkId,
//   getWorkerByClerkId,
// } from "@/actions/profiles";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import LocationPicker from "@/components/LocationPicker";
// import HouseLayoutEditor from "@/components/HouseLayoutEditor";
// import { toast } from "sonner";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// interface Room {
//   type: string;
//   instructions: string;
//   position?: { x: number; y: number; width: number; height: number };
// }

// interface FormData {
//   name: string;
//   location: string;
//   profileType: "employer" | "worker";
//   image?: string;
//   strengths?: string;
//   availability?: string;
//   rooms?: Room[];
// }

// export default function CreateProfile() {
//   const { user, isLoaded } = useUser();
//   const router = useRouter();
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     location: "",
//     profileType: "employer",
//     strengths: "",
//     availability: "",
//     rooms: [],
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [existingProfileType, setExistingProfileType] = useState<
//     "employer" | "worker" | "pending" | null
//   >(null);

//   useEffect(() => {
//     if (!isLoaded || !user) return;

//     setFormData((prev) => ({
//       ...prev,
//       name: user.fullName || "",
//       image: user.imageUrl || "",
//     }));

//     const fetchProfile = async () => {
//       try {
//         const [employer, worker] = await Promise.all([
//           getEmployerByClerkId(user.id),
//           getWorkerByClerkId(user.id),
//         ]);

//         if (employer) {
//           const rooms = Array.isArray(employer.rooms)
//             ? employer.rooms.filter(
//                 (room): room is Room =>
//                   room &&
//                   typeof room === "object" &&
//                   "type" in room &&
//                   "instructions" in room
//               )
//             : [];
//           setFormData({
//             name: employer.name,
//             location: JSON.stringify({
//               address: employer.address,
//               coordinates: employer.coordinates,
//             }),
//             profileType: "employer",
//             image: employer.image || "",
//             rooms,
//           });
//           setExistingProfileType("employer");
//         } else if (worker) {
//           setFormData({
//             name: worker.name,
//             location: JSON.stringify({
//               address: worker.address,
//               coordinates: worker.coordinates,
//             }),
//             profileType: "worker",
//             image: worker.image || "",
//             strengths: worker.strengths || "",
//             availability: worker.availability || "",
//             rooms: [],
//           });
//           setExistingProfileType("worker");
//         } else {
//           setExistingProfileType("pending");
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         toast.error("Failed to load existing profile.");
//       }
//     };

//     fetchProfile();
//   }, [user, isLoaded]);

//   // Prevent creating a new profile if one exists
//   useEffect(() => {
//     if (
//       existingProfileType &&
//       existingProfileType !== "pending" &&
//       formData.profileType !== existingProfileType
//     ) {
//       toast.error(
//         `You already have a ${existingProfileType} profile. You can only edit your existing profile.`
//       );
//       router.push(`/view-profile/${user?.id}`);
//     }
//   }, [existingProfileType, formData.profileType, router, user]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (!file.type.startsWith("image/")) {
//         toast.error("Please upload a valid image file.");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Image size must be less than 5MB.");
//         return;
//       }
//       setImageFile(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) {
//       toast.error("Please sign in to create a profile.");
//       return;
//     }

//     // Double-check existing profile type
//     if (
//       existingProfileType &&
//       existingProfileType !== "pending" &&
//       formData.profileType !== existingProfileType
//     ) {
//       toast.error(
//         `You cannot create a ${formData.profileType} profile. You already have a ${existingProfileType} profile.`
//       );
//       return;
//     }

//     // Validate inputs
//     if (!formData.name.trim() || formData.name.length > 100) {
//       toast.error("Name must be between 1 and 100 characters.");
//       return;
//     }
//     if (formData.profileType === "worker") {
//       if (formData.strengths && formData.strengths.length > 500) {
//         toast.error("Strengths must be less than 500 characters.");
//         return;
//       }
//       if (formData.availability && formData.availability.length > 500) {
//         toast.error("Availability must be less than 500 characters.");
//         return;
//       }
//     }
//     if (
//       formData.profileType === "employer" &&
//       (!formData.rooms || formData.rooms.length === 0)
//     ) {
//       toast.error(
//         "At least one room with instructions is required for employer profiles."
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       let imageUrl = formData.image || "";
//       if (imageFile) {
//         const imageFormData = new FormData();
//         imageFormData.append("file", imageFile);
//         const response = await fetch("/api/upload-image", {
//           method: "POST",
//           body: imageFormData,
//         });
//         if (!response.ok) {
//           throw new Error(`Image upload failed: ${response.statusText}`);
//         }
//         const result = await response.json();
//         if (!result.imageUrl || typeof result.imageUrl !== "string") {
//           throw new Error("Invalid image URL from server");
//         }
//         imageUrl = result.imageUrl;
//       }

//       let parsedLocation;
//       try {
//         parsedLocation = JSON.parse(formData.location || "{}");
//         if (!parsedLocation.address || !parsedLocation.coordinates) {
//           throw new Error("Invalid location data");
//         }
//       } catch {
//         toast.error("Please select a valid location.");
//         setLoading(false);
//         return;
//       }

//       const plainRooms =
//         formData.rooms?.map((room) => ({
//           type: room.type,
//           instructions: room.instructions,
//           position: room.position
//             ? {
//                 x: Number(room.position.x),
//                 y: Number(room.position.y),
//                 width: Number(room.position.width),
//                 height: Number(room.position.height),
//               }
//             : undefined,
//         })) || [];

//       const submitData = {
//         name: formData.name.trim(),
//         location: JSON.stringify({
//           address: parsedLocation.address,
//           coordinates: {
//             lat: Number(parsedLocation.coordinates.lat),
//             lng: Number(parsedLocation.coordinates.lng),
//           },
//         }),
//         profileType: formData.profileType,
//         image: imageUrl || undefined,
//         ...(formData.profileType === "employer" && { rooms: plainRooms }),
//         ...(formData.profileType === "worker" && {
//           strengths: formData.strengths?.trim(),
//           availability: formData.availability?.trim(),
//         }),
//       };

//       await createUserProfile(submitData);
//       toast.success("Profile saved successfully!");
//       router.push(`/view-profile/${user.id}`);
//     } catch (error) {
//       console.error("Error saving profile:", error);
//       toast.error(
//         `Failed to save profile: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto py-8 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="max-w-2xl mx-auto"
//       >
//         <Card className="bg-gradient-to-br from-purple-800 to-indigo-800 text-white shadow-xl border-0">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-purple-100">
//               {existingProfileType === "pending"
//                 ? "Create Profile"
//                 : "Edit Profile"}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6" noValidate>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 0.1 }}
//               >
//                 <label className="text-sm font-medium text-purple-200">
//                   Name
//                 </label>
//                 <Input
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   placeholder="Enter your name"
//                   required
//                   maxLength={100}
//                   className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                 />
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 0.2 }}
//               >
//                 <label className="text-sm font-medium text-purple-200">
//                   Location
//                 </label>
//                 <LocationPicker
//                   value={formData.location}
//                   onChange={(location) =>
//                     setFormData({ ...formData, location })
//                   }
//                 />
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 0.3 }}
//               >
//                 <label className="text-sm font-medium text-purple-200">
//                   Profile Type
//                 </label>
//                 <Select
//                   value={formData.profileType}
//                   onValueChange={(value: "employer" | "worker") =>
//                     setFormData({
//                       ...formData,
//                       profileType: value,
//                       rooms: value === "worker" ? [] : formData.rooms,
//                     })
//                   }
//                   disabled={
//                     existingProfileType !== null &&
//                     existingProfileType !== "pending"
//                   }
//                 >
//                   <SelectTrigger
//                     aria-label="Select profile type"
//                     className="bg-purple-950/50 text-white border-purple-400 focus:ring-purple-500 focus:border-purple-500"
//                   >
//                     <SelectValue placeholder="Select profile type" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-purple-950 text-white border-purple-400">
//                     <SelectItem value="employer">Employer</SelectItem>
//                     <SelectItem value="worker">Worker</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 0.4 }}
//               >
//                 <label className="text-sm font-medium text-purple-200">
//                   Profile Image
//                 </label>
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="bg-purple-950/50 text-white border-purple-400 file:text-purple-200 file:bg-purple-700 file:border-0 file:rounded file:px-3 file:py-1 hover:file:bg-purple-600"
//                 />
//               </motion.div>
//               {formData.profileType === "worker" && (
//                 <>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.5 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       Strengths
//                     </label>
//                     <Input
//                       value={formData.strengths || ""}
//                       onChange={(e) =>
//                         setFormData({ ...formData, strengths: e.target.value })
//                       }
//                       placeholder="Enter your strengths"
//                       maxLength={500}
//                       className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                     />
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.6 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       Availability
//                     </label>
//                     <Input
//                       value={formData.availability || ""}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           availability: e.target.value,
//                         })
//                       }
//                       placeholder="Enter your availability"
//                       maxLength={500}
//                       className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                     />
//                   </motion.div>
//                 </>
//               )}
//               {formData.profileType === "employer" && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4, delay: 0.7 }}
//                 >
//                   <label className="text-sm font-medium text-purple-200">
//                     House Layout & Instructions
//                   </label>
//                   <HouseLayoutEditor
//                     rooms={formData.rooms || []}
//                     setRooms={(rooms) => setFormData({ ...formData, rooms })}
//                   />
//                 </motion.div>
//               )}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 0.8 }}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
//                 >
//                   {loading ? "Saving..." : "Save Profile"}
//                 </Button>
//               </motion.div>
//             </form>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }
// "use client";

// import { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import {
//   createUserProfile,
//   getEmployerByClerkId,
//   getWorkerByClerkId,
// } from "@/actions/profiles";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import LocationPicker from "@/components/LocationPicker";
// import HouseLayoutEditor from "@/components/HouseLayoutEditor";
// import { toast } from "sonner";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, X } from "lucide-react";

// interface Room {
//   type: string;
//   instructions: string;
//   position?: { x: number; y: number; width: number; height: number };
// }

// interface Reference {
//   name: string;
//   contact: string;
//   testimonial: string;
// }

// interface FormData {
//   name: string;
//   location: string;
//   profileType: "employer" | "worker";
//   image?: string;
//   strengths?: string;
//   availability?: string;
//   rooms?: Room[];
//   contactNumber?: string | null;
//   email?: string | null;
//   preferredSchedule?: string | null;
//   additionalNotes?: string | null;
//   experienceLevel?: "Beginner" | "Intermediate" | "Expert";
//   preferredWorkTypes?: string[];
//   references?: Reference[];
// }

// export default function CreateProfile() {
//   const { user, isLoaded } = useUser();
//   const router = useRouter();
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     location: "",
//     profileType: "employer",
//     strengths: "",
//     availability: "",
//     rooms: [],
//     contactNumber: null,
//     email: null,
//     preferredSchedule: null,
//     additionalNotes: null,
//     experienceLevel: undefined,
//     preferredWorkTypes: [],
//     references: [],
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [existingProfileType, setExistingProfileType] = useState<
//     "employer" | "worker" | "pending" | null
//   >(null);
//   const [newReference, setNewReference] = useState<Reference>({
//     name: "",
//     contact: "",
//     testimonial: "",
//   });

//   useEffect(() => {
//     if (!isLoaded || !user) return;
//     setFormData((prev) => ({
//       ...prev,
//       name: user.fullName || "",
//       image: user.imageUrl || "",
//     }));

//     const fetchProfile = async () => {
//       try {
//         const [employer, worker] = await Promise.all([
//           getEmployerByClerkId(user.id),
//           getWorkerByClerkId(user.id),
//         ]);
//         if (employer) {
//           const rooms = Array.isArray(employer.rooms)
//             ? employer.rooms.filter(
//                 (room): room is Room =>
//                   room &&
//                   typeof room === "object" &&
//                   "type" in room &&
//                   "instructions" in room
//               )
//             : [];
//           setFormData({
//             name: employer.name,
//             location: JSON.stringify({
//               address: employer.address,
//               coordinates: employer.coordinates,
//             }),
//             profileType: "employer",
//             image: employer.image || "",
//             rooms,
//             contactNumber: employer.contactNumber ?? null,
//             email: employer.email ?? null,
//             preferredSchedule: employer.preferredSchedule ?? null,
//             additionalNotes: employer.additionalNotes ?? null,
//           });
//           setExistingProfileType("employer");
//         } else if (worker) {
//           setFormData({
//             name: worker.name,
//             location: JSON.stringify({
//               address: worker.address,
//               coordinates: worker.coordinates,
//             }),
//             profileType: "worker",
//             image: worker.image || "",
//             strengths: worker.strengths || "",
//             availability: worker.availability || "",
//             contactNumber: worker.contactNumber ?? null,
//             email: worker.email ?? null,
//             experienceLevel: worker.experienceLevel ?? undefined,
//             preferredWorkTypes: worker.preferredWorkTypes || [],
//             references: worker.references || [],
//             rooms: [],
//           });
//           setExistingProfileType("worker");
//         } else {
//           setExistingProfileType("pending");
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         toast.error("Failed to load existing profile.");
//       }
//     };
//     fetchProfile();
//   }, [user, isLoaded]);

//   useEffect(() => {
//     if (
//       existingProfileType &&
//       existingProfileType !== "pending" &&
//       formData.profileType !== existingProfileType
//     ) {
//       toast.error(
//         `You already have a ${existingProfileType} profile. You can only edit your existing profile.`
//       );
//       router.push(`/view-profile/${user?.id}`);
//     }
//   }, [existingProfileType, formData.profileType, router, user]);

//   useEffect(() => {
//     return () => {
//       if (imagePreview) URL.revokeObjectURL(imagePreview);
//     };
//   }, [imagePreview]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (!file.type.startsWith("image/")) {
//         toast.error("Please upload a valid image file.");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Image size must be less than 5MB.");
//         return;
//       }
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleWorkTypeChange = (type: string) => {
//     setFormData((prev) => {
//       const workTypes = prev.preferredWorkTypes || [];
//       if (workTypes.includes(type)) {
//         return {
//           ...prev,
//           preferredWorkTypes: workTypes.filter((t) => t !== type),
//         };
//       } else {
//         return {
//           ...prev,
//           preferredWorkTypes: [...workTypes, type],
//         };
//       }
//     });
//   };

//   const addReference = () => {
//     if (
//       !newReference.name.trim() ||
//       !newReference.contact.trim() ||
//       !newReference.testimonial.trim()
//     ) {
//       toast.error("Please fill all reference fields.");
//       return;
//     }
//     setFormData((prev) => ({
//       ...prev,
//       references: [...(prev.references || []), newReference],
//     }));
//     setNewReference({ name: "", contact: "", testimonial: "" });
//     toast.success("Reference added.");
//   };

//   const removeReference = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       references: (prev.references || []).filter((_, i) => i !== index),
//     }));
//     toast.info("Reference removed.");
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) {
//       toast.error("Please sign in to create a profile.");
//       return;
//     }

//     if (
//       existingProfileType &&
//       existingProfileType !== "pending" &&
//       formData.profileType !== existingProfileType
//     ) {
//       toast.error(
//         `You cannot create a ${formData.profileType} profile. You already have a ${existingProfileType} profile.`
//       );
//       return;
//     }

//     if (!formData.name.trim() || formData.name.length > 100) {
//       toast.error("Name must be between 1 and 100 characters.");
//       return;
//     }

//     if (formData.profileType === "worker") {
//       if (formData.strengths && formData.strengths.length > 500) {
//         toast.error("Strengths must be less than 500 characters.");
//         return;
//       }
//       if (formData.availability && formData.availability.length > 500) {
//         toast.error("Availability must be less than 500 characters.");
//         return;
//       }
//       if (
//         formData.contactNumber &&
//         !/^\+?\d{7,15}$/.test(formData.contactNumber)
//       ) {
//         toast.error("Invalid contact number format.");
//         return;
//       }
//       if (
//         formData.email &&
//         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
//       ) {
//         toast.error("Invalid email format.");
//         return;
//       }
//       if (
//         formData.experienceLevel &&
//         !["Beginner", "Intermediate", "Expert"].includes(
//           formData.experienceLevel
//         )
//       ) {
//         toast.error("Invalid experience level.");
//         return;
//       }
//     }

//     if (formData.profileType === "employer") {
//       if (
//         formData.contactNumber &&
//         !/^\+?\d{7,15}$/.test(formData.contactNumber)
//       ) {
//         toast.error("Invalid contact number format.");
//         return;
//       }
//       if (
//         formData.email &&
//         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
//       ) {
//         toast.error("Invalid email format.");
//         return;
//       }
//       if (
//         formData.preferredSchedule &&
//         formData.preferredSchedule.length > 500
//       ) {
//         toast.error("Preferred schedule must be less than 500 characters.");
//         return;
//       }
//       if (formData.additionalNotes && formData.additionalNotes.length > 1000) {
//         toast.error("Additional notes must be less than 1000 characters.");
//         return;
//       }
//     }

//     setLoading(true);
//     try {
//       let imageUrl = formData.image || "";
//       if (imageFile) {
//         const imageFormData = new FormData();
//         imageFormData.append("file", imageFile);
//         const response = await fetch("/api/upload-image", {
//           method: "POST",
//           body: imageFormData,
//         });
//         if (!response.ok) {
//           throw new Error(`Image upload failed: ${response.statusText}`);
//         }
//         const result = await response.json();
//         if (!result.imageUrl || typeof result.imageUrl !== "string") {
//           throw new Error("Invalid image URL from server");
//         }
//         imageUrl = result.imageUrl;
//       }

//       let parsedLocation;
//       try {
//         parsedLocation = JSON.parse(formData.location || "{}");
//         if (!parsedLocation.address || !parsedLocation.coordinates) {
//           throw new Error("Invalid location data");
//         }
//       } catch {
//         toast.error("Please select a valid location.");
//         setLoading(false);
//         return;
//       }

//       const plainRooms =
//         formData.rooms?.map((room) => ({
//           type: room.type,
//           instructions: room.instructions,
//           position: room.position
//             ? {
//                 x: Number(room.position.x),
//                 y: Number(room.position.y),
//                 width: Number(room.position.width),
//                 height: Number(room.position.height),
//               }
//             : undefined,
//         })) || [];

//       const submitData = {
//         name: formData.name.trim(),
//         location: JSON.stringify({
//           address: parsedLocation.address,
//           coordinates: {
//             lat: Number(parsedLocation.coordinates.lat),
//             lng: Number(parsedLocation.coordinates.lng),
//           },
//         }),
//         profileType: formData.profileType,
//         image: imageUrl || undefined,
//         ...(formData.profileType === "employer" && {
//           rooms: plainRooms,
//           contactNumber: formData.contactNumber?.trim() ?? undefined,
//           email: formData.email?.trim() ?? undefined,
//           preferredSchedule: formData.preferredSchedule?.trim() ?? undefined,
//           additionalNotes: formData.additionalNotes?.trim() ?? undefined,
//         }),
//         ...(formData.profileType === "worker" && {
//           strengths: formData.strengths?.trim(),
//           availability: formData.availability?.trim(),
//           contactNumber: formData.contactNumber?.trim() ?? undefined,
//           email: formData.email?.trim() ?? undefined,
//           experienceLevel: formData.experienceLevel,
//           preferredWorkTypes: formData.preferredWorkTypes,
//           references: formData.references,
//         }),
//       };

//       await createUserProfile(submitData);
//       toast.success("Profile saved successfully!");
//       router.push(`/view-profile/${user.id}`);
//     } catch (error) {
//       console.error("Error saving profile:", error);
//       toast.error(
//         `Failed to save profile: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto py-8 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="max-w-2xl mx-auto"
//       >
//         <Card className="bg-gradient-to-br from-purple-800 to-indigo-800 text-white shadow-xl border-0">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-purple-100">
//               {existingProfileType === "pending"
//                 ? "Create Profile"
//                 : "Edit Profile"}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6" noValidate>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 0.1 }}
//               >
//                 <label className="text-sm font-medium text-purple-200">
//                   Name
//                 </label>
//                 <Input
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   placeholder="Enter your name"
//                   required
//                   maxLength={100}
//                   aria-label="Name"
//                   className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                 />
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 0.2 }}
//               >
//                 <label className="text-sm font-medium text-purple-200">
//                   Location
//                 </label>
//                 <LocationPicker
//                   value={formData.location}
//                   onChange={(location) =>
//                     setFormData({ ...formData, location })
//                   }
//                 />
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 0.3 }}
//               >
//                 <label className="text-sm font-medium text-purple-200">
//                   Profile Type
//                 </label>
//                 <Select
//                   value={formData.profileType}
//                   onValueChange={(value: "employer" | "worker") =>
//                     setFormData({
//                       ...formData,
//                       profileType: value,
//                       rooms: value === "worker" ? [] : formData.rooms,
//                     })
//                   }
//                   disabled={
//                     existingProfileType !== null &&
//                     existingProfileType !== "pending"
//                   }
//                 >
//                   <SelectTrigger
//                     aria-label="Select profile type"
//                     className="bg-purple-950/50 text-white border-purple-400 focus:ring-purple-500 focus:border-purple-500"
//                   >
//                     <SelectValue placeholder="Select profile type" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-purple-950 text-white border-purple-400">
//                     <SelectItem value="employer">Employer</SelectItem>
//                     <SelectItem value="worker">Worker</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 0.4 }}
//               >
//                 <label className="text-sm font-medium text-purple-200">
//                   Profile Image
//                 </label>
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   aria-label="Profile image upload"
//                   className="bg-purple-950/50 text-white border-purple-400 file:text-purple-200 file:bg-purple-700 file:border-0 file:rounded file:px-3 file:py-1 hover:file:bg-purple-600"
//                 />
//                 {imagePreview && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="mt-2"
//                   >
//                     <img
//                       src={imagePreview}
//                       alt="Profile preview"
//                       className="w-32 h-32 rounded-full object-cover"
//                     />
//                   </motion.div>
//                 )}
//               </motion.div>
//               {formData.profileType === "worker" && (
//                 <>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.5 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       Strengths
//                     </label>
//                     <Input
//                       value={formData.strengths || ""}
//                       onChange={(e) =>
//                         setFormData({ ...formData, strengths: e.target.value })
//                       }
//                       placeholder="Enter your strengths"
//                       maxLength={500}
//                       aria-label="Strengths"
//                       className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                     />
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.6 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       Availability
//                     </label>
//                     <Input
//                       value={formData.availability || ""}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           availability: e.target.value,
//                         })
//                       }
//                       placeholder="Enter your availability"
//                       maxLength={500}
//                       aria-label="Availability"
//                       className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                     />
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.7 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       Contact Number
//                     </label>
//                     <Input
//                       value={formData.contactNumber || ""}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           contactNumber: e.target.value,
//                         })
//                       }
//                       placeholder="Enter your contact number"
//                       maxLength={20}
//                       aria-label="Contact number"
//                       className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                     />
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.8 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       Email Address
//                     </label>
//                     <Input
//                       type="email"
//                       value={formData.email || ""}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                       placeholder="Enter your email address"
//                       maxLength={255}
//                       aria-label="Email address"
//                       className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                     />
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.9 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       Experience Level
//                     </label>
//                     <Select
//                       value={formData.experienceLevel}
//                       onValueChange={(
//                         value: "Beginner" | "Intermediate" | "Expert"
//                       ) => setFormData({ ...formData, experienceLevel: value })}
//                     >
//                       <SelectTrigger
//                         aria-label="Select experience level"
//                         className="bg-purple-950/50 text-white border-purple-400 focus:ring-purple-500 focus:border-purple-500"
//                       >
//                         <SelectValue placeholder="Select experience level" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-purple-950 text-white border-purple-400">
//                         <SelectItem value="Beginner">Beginner</SelectItem>
//                         <SelectItem value="Intermediate">
//                           Intermediate
//                         </SelectItem>
//                         <SelectItem value="Expert">Expert</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 1.0 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       Preferred Work Types
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {[
//                         "Cleaning",
//                         "Cooking",
//                         "Childcare",
//                         "Laundry",
//                         "Gardening",
//                       ].map((type) => (
//                         <Button
//                           key={type}
//                           type="button"
//                           variant={
//                             formData.preferredWorkTypes?.includes(type)
//                               ? "default"
//                               : "outline"
//                           }
//                           className="bg-purple-950/50 text-white border-purple-400 hover:bg-purple-600"
//                           onClick={() => handleWorkTypeChange(type)}
//                         >
//                           {type}
//                         </Button>
//                       ))}
//                     </div>
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 1.1 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       References
//                     </label>
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Input
//                           value={newReference.name}
//                           onChange={(e) =>
//                             setNewReference({
//                               ...newReference,
//                               name: e.target.value,
//                             })
//                           }
//                           placeholder="Reference name"
//                           maxLength={100}
//                           aria-label="Reference name"
//                           className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300"
//                         />
//                         <Input
//                           value={newReference.contact}
//                           onChange={(e) =>
//                             setNewReference({
//                               ...newReference,
//                               contact: e.target.value,
//                             })
//                           }
//                           placeholder="Reference contact"
//                           maxLength={50}
//                           aria-label="Reference contact"
//                           className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300"
//                         />
//                         <Input
//                           value={newReference.testimonial}
//                           onChange={(e) =>
//                             setNewReference({
//                               ...newReference,
//                               testimonial: e.target.value,
//                             })
//                           }
//                           placeholder="Reference testimonial"
//                           maxLength={500}
//                           aria-label="Reference testimonial"
//                           className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300"
//                         />
//                         <Button
//                           type="button"
//                           onClick={addReference}
//                           className="bg-purple-600 hover:bg-purple-700"
//                         >
//                           <Plus className="mr-2 h-4 w-4" /> Add Reference
//                         </Button>
//                       </div>
//                       {formData.references &&
//                         formData.references.length > 0 && (
//                           <div className="space-y-2">
//                             {formData.references.map((ref, index) => (
//                               <motion.div
//                                 key={index}
//                                 initial={{ opacity: 0, x: -10 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ duration: 0.3 }}
//                                 className="flex items-center gap-2 bg-purple-950/30 p-3 rounded-md"
//                               >
//                                 <div className="flex-1">
//                                   <p className="text-sm text-purple-100">
//                                     <strong>{ref.name}</strong> ({ref.contact}):{" "}
//                                     {ref.testimonial}
//                                   </p>
//                                 </div>
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   onClick={() => removeReference(index)}
//                                   className="text-purple-300 hover:text-purple-100"
//                                 >
//                                   <X className="h-4 w-4" />
//                                 </Button>
//                               </motion.div>
//                             ))}
//                           </div>
//                         )}
//                     </div>
//                   </motion.div>
//                 </>
//               )}
//               {formData.profileType === "employer" && (
//                 <>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.5 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       Contact Number
//                     </label>
//                     <Input
//                       value={formData.contactNumber || ""}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           contactNumber: e.target.value,
//                         })
//                       }
//                       placeholder="Enter your contact number"
//                       maxLength={20}
//                       aria-label="Contact number"
//                       className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                     />
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.6 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       Email Address
//                     </label>
//                     <Input
//                       type="email"
//                       value={formData.email || ""}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                       placeholder="Enter your email address"
//                       maxLength={255}
//                       aria-label="Email address"
//                       className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                     />
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.7 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       Preferred Schedule
//                     </label>
//                     <Input
//                       value={formData.preferredSchedule || ""}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           preferredSchedule: e.target.value,
//                         })
//                       }
//                       placeholder="Enter your preferred schedule (e.g., Mon-Fri, 9 AM-2 PM)"
//                       maxLength={500}
//                       aria-label="Preferred schedule"
//                       className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                     />
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.8 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       Additional Notes
//                     </label>
//                     <Textarea
//                       value={formData.additionalNotes || ""}
//                       onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
//                         setFormData({
//                           ...formData,
//                           additionalNotes: e.target.value,
//                         })
//                       }
//                       placeholder="Enter any additional notes or preferences"
//                       maxLength={1000}
//                       rows={4}
//                       aria-label="Additional notes"
//                       className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                     />
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.9 }}
//                   >
//                     <label className="text-sm font-medium text-purple-200">
//                       House Layout
//                     </label>
//                     <HouseLayoutEditor
//                       rooms={formData.rooms || []}
//                       setRooms={(rooms) => setFormData({ ...formData, rooms })}
//                     />
//                   </motion.div>
//                 </>
//               )}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{
//                   duration: 0.4,
//                   delay: formData.profileType === "worker" ? 1.2 : 1.0,
//                 }}
//               >
//                 <Button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-purple-600 hover:bg-purple-700 text-white"
//                 >
//                   {loading
//                     ? "Saving..."
//                     : existingProfileType === "pending"
//                     ? "Create Profile"
//                     : "Update Profile"}
//                 </Button>
//               </motion.div>
//             </form>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }

// profile/page.tsx
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationPicker from "@/components/LocationPicker";
import HouseLayoutEditor from "@/components/HouseLayoutEditor";
// import HouseView from "@/components/HouseView";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface Room {
  type: string;
  instructions: string;
  position?: { x: number; y: number; width: number; height: number };
}

interface Reference {
  name: string;
  contact: string;
  testimonial: string;
}

interface FormData {
  name: string;
  location: string;
  profileType: "employer" | "worker";
  image?: string;
  strengths?: string;
  availability?: string;
  rooms?: Room[];
  contactNumber?: string | null;
  email?: string | null;
  preferredSchedule?: string | null;
  additionalNotes?: string | null;
  experienceLevel?: "Beginner" | "Intermediate" | "Expert";
  preferredWorkTypes?: string[];
  references?: Reference[];
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
    contactNumber: null,
    email: null,
    preferredSchedule: null,
    additionalNotes: null,
    experienceLevel: undefined,
    preferredWorkTypes: [],
    references: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingProfileType, setExistingProfileType] = useState<
    "employer" | "worker" | "pending" | null
  >(null);
  const [newReference, setNewReference] = useState<Reference>({
    name: "",
    contact: "",
    testimonial: "",
  });

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
            contactNumber: employer.contactNumber ?? null,
            email: employer.email ?? null,
            preferredSchedule: employer.preferredSchedule ?? null,
            additionalNotes: employer.additionalNotes ?? null,
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
            contactNumber: worker.contactNumber ?? null,
            email: worker.email ?? null,
            experienceLevel: worker.experienceLevel ?? undefined,
            preferredWorkTypes: worker.preferredWorkTypes || [],
            references: worker.references || [],
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

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

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
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleWorkTypeChange = (type: string) => {
    setFormData((prev) => {
      const workTypes = prev.preferredWorkTypes || [];
      if (workTypes.includes(type)) {
        return {
          ...prev,
          preferredWorkTypes: workTypes.filter((t) => t !== type),
        };
      } else {
        return {
          ...prev,
          preferredWorkTypes: [...workTypes, type],
        };
      }
    });
  };

  const addReference = () => {
    if (
      !newReference.name.trim() ||
      !newReference.contact.trim() ||
      !newReference.testimonial.trim()
    ) {
      toast.error("Please fill all reference fields.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      references: [...(prev.references || []), newReference],
    }));
    setNewReference({ name: "", contact: "", testimonial: "" });
    toast.success("Reference added.");
  };

  const removeReference = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      references: (prev.references || []).filter((_, i) => i !== index),
    }));
    toast.info("Reference removed.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to create a profile.");
      return;
    }

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

    if (!formData.name.trim() || formData.name.length > 100) {
      toast.error("Name must be between 1 and 100 characters.");
      return;
    }

    if (formData.profileType === "employer" && formData.rooms?.length) {
      if (!formData.rooms.some((room) => room.instructions.trim())) {
        toast.error("At least one room must have instructions.");
        return;
      }
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
      if (
        formData.contactNumber &&
        !/^\+?\d{7,15}$/.test(formData.contactNumber)
      ) {
        toast.error("Invalid contact number format.");
        return;
      }
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        toast.error("Invalid email format.");
        return;
      }
      if (
        formData.experienceLevel &&
        !["Beginner", "Intermediate", "Expert"].includes(
          formData.experienceLevel
        )
      ) {
        toast.error("Invalid experience level.");
        return;
      }
    }

    if (formData.profileType === "employer") {
      if (
        formData.contactNumber &&
        !/^\+?\d{7,15}$/.test(formData.contactNumber)
      ) {
        toast.error("Invalid contact number format.");
        return;
      }
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        toast.error("Invalid email format.");
        return;
      }
      if (
        formData.preferredSchedule &&
        formData.preferredSchedule.length > 500
      ) {
        toast.error("Preferred schedule must be less than 500 characters.");
        return;
      }
      if (formData.additionalNotes && formData.additionalNotes.length > 1000) {
        toast.error("Additional notes must be less than 1000 characters.");
        return;
      }
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
        ...(formData.profileType === "employer" && {
          rooms: plainRooms,
          contactNumber: formData.contactNumber?.trim() ?? undefined,
          email: formData.email?.trim() ?? undefined,
          preferredSchedule: formData.preferredSchedule?.trim() ?? undefined,
          additionalNotes: formData.additionalNotes?.trim() ?? undefined,
        }),
        ...(formData.profileType === "worker" && {
          strengths: formData.strengths?.trim(),
          availability: formData.availability?.trim(),
          contactNumber: formData.contactNumber?.trim() ?? undefined,
          email: formData.email?.trim() ?? undefined,
          experienceLevel: formData.experienceLevel,
          preferredWorkTypes: formData.preferredWorkTypes,
          references: formData.references,
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
        className="max-w-3xl mx-auto"
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
                  aria-label="Name"
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
                  aria-label="Profile image upload"
                  className="bg-purple-950/50 text-white border-purple-400 file:text-purple-200 file:bg-purple-700 file:border-0 file:rounded file:px-3 file:py-1 hover:file:bg-purple-600"
                />
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2"
                  >
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  </motion.div>
                )}
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
                      aria-label="Strengths"
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
                      aria-label="Availability"
                      className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <label className="text-sm font-medium text-purple-200">
                      Contact Number
                    </label>
                    <Input
                      value={formData.contactNumber || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactNumber: e.target.value,
                        })
                      }
                      placeholder="Enter your contact number"
                      maxLength={20}
                      aria-label="Contact number"
                      className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    <label className="text-sm font-medium text-purple-200">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter your email address"
                      maxLength={255}
                      aria-label="Email address"
                      className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                  >
                    <label className="text-sm font-medium text-purple-200">
                      Experience Level
                    </label>
                    <Select
                      value={formData.experienceLevel}
                      onValueChange={(
                        value: "Beginner" | "Intermediate" | "Expert"
                      ) => setFormData({ ...formData, experienceLevel: value })}
                    >
                      <SelectTrigger
                        aria-label="Select experience level"
                        className="bg-purple-950/50 text-white border-purple-400 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-950 text-white border-purple-400">
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.0 }}
                  >
                    <label className="text-sm font-medium text-purple-200">
                      Preferred Work Types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Cleaning",
                        "Cooking",
                        "Childcare",
                        "Laundry",
                        "Gardening",
                      ].map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={
                            formData.preferredWorkTypes?.includes(type)
                              ? "default"
                              : "outline"
                          }
                          className="bg-purple-950/50 text-white border-purple-400 hover:bg-purple-600"
                          onClick={() => handleWorkTypeChange(type)}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.1 }}
                  >
                    <label className="text-sm font-medium text-purple-200">
                      References
                    </label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          value={newReference.name}
                          onChange={(e) =>
                            setNewReference({
                              ...newReference,
                              name: e.target.value,
                            })
                          }
                          placeholder="Reference name"
                          maxLength={100}
                          aria-label="Reference name"
                          className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300"
                        />
                        <Input
                          value={newReference.contact}
                          onChange={(e) =>
                            setNewReference({
                              ...newReference,
                              contact: e.target.value,
                            })
                          }
                          placeholder="Reference contact"
                          maxLength={50}
                          aria-label="Reference contact"
                          className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300"
                        />
                        <Input
                          value={newReference.testimonial}
                          onChange={(e) =>
                            setNewReference({
                              ...newReference,
                              testimonial: e.target.value,
                            })
                          }
                          placeholder="Reference testimonial"
                          maxLength={500}
                          aria-label="Reference testimonial"
                          className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300"
                        />
                        <Button
                          type="button"
                          onClick={addReference}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Reference
                        </Button>
                      </div>
                      {formData.references &&
                        formData.references.length > 0 && (
                          <div className="space-y-2">
                            {formData.references.map((ref, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-2 bg-purple-950/30 p-3 rounded-md"
                              >
                                <div className="flex-1">
                                  <p className="text-sm text-purple-100">
                                    <strong>{ref.name}</strong> ({ref.contact}):{" "}
                                    {ref.testimonial}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => removeReference(index)}
                                  className="text-purple-300 hover:text-purple-100"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        )}
                    </div>
                  </motion.div>
                </>
              )}

              {formData.profileType === "employer" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <label className="text-sm font-medium text-purple-200">
                      Contact Number
                    </label>
                    <Input
                      value={formData.contactNumber || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactNumber: e.target.value,
                        })
                      }
                      placeholder="Enter your contact number"
                      maxLength={20}
                      aria-label="Contact number"
                      className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <label className="text-sm font-medium text-purple-200">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter your email address"
                      maxLength={255}
                      aria-label="Email address"
                      className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <label className="text-sm font-medium text-purple-200">
                      Preferred Schedule
                    </label>
                    <Input
                      value={formData.preferredSchedule || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredSchedule: e.target.value,
                        })
                      }
                      placeholder="Enter your preferred schedule (e.g., Mon-Fri, 9 AM-2 PM)"
                      maxLength={500}
                      aria-label="Preferred schedule"
                      className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    <label className="text-sm font-medium text-purple-200">
                      Additional Notes
                    </label>
                    <Textarea
                      value={formData.additionalNotes || ""}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData({
                          ...formData,
                          additionalNotes: e.target.value,
                        })
                      }
                      placeholder="Enter any additional notes or preferences"
                      maxLength={1000}
                      rows={4}
                      aria-label="Additional notes"
                      className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                  >
                    <label className="text-sm font-medium text-purple-200">
                      House Layout Editor
                    </label>
                    <HouseLayoutEditor
                      rooms={formData.rooms || []}
                      setRooms={(rooms) => setFormData({ ...formData, rooms })}
                    />
                  </motion.div>

                  {/* {formData.rooms && formData.rooms.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.0 }}
                    >
                      <label className="text-sm font-medium text-purple-200">
                        Layout Preview
                      </label>
                      <HouseView rooms={formData.rooms} />
                    </motion.div>
                  )} */}
                </>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: formData.profileType === "worker" ? 1.2 : 1.1,
                }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading
                    ? "Saving..."
                    : existingProfileType === "pending"
                    ? "Create Profile"
                    : "Update Profile"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
