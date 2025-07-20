// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { PulseLoader } from "react-spinners";
// import { toast } from "sonner";
// import MapDisplay from "@/components/MapDisplay";
// import InstructionTranslator from "@/components/InstructionTranslator";
// import {
//   getEmployerByClerkId,
//   getWorkerByClerkId,
//   Employer,
//   Worker,
// } from "@/actions/profiles";
// import * as fabric from "fabric";

// declare module "fabric" {
//   interface Group {
//     data?: { type: string; instructions: string };
//   }
// }

// export default function ViewProfile({ params }: { params: { id: string } }) {
//   const { user, isLoaded } = useUser();
//   const router = useRouter();
//   const [profile, setProfile] = useState<Employer | Worker | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [profileType, setProfileType] = useState<"employer" | "worker" | null>(
//     null
//   );
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!isLoaded) return;
//       if (!user) {
//         toast.error("Please sign in to view profiles.");
//         router.push("/sign-in");
//         return;
//       }
//       setLoading(true);
//       try {
//         const [employer, worker] = await Promise.all([
//           getEmployerByClerkId(params.id),
//           getWorkerByClerkId(params.id),
//         ]);
//         if (employer) {
//           setProfile(employer);
//           setProfileType("employer");
//         } else if (worker) {
//           setProfile(worker);
//           setProfileType("worker");
//         } else {
//           toast.error("Profile not found.");
//           router.push("/employers");
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         toast.error("Failed to load profile.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [user, isLoaded, params.id, router]);

//   useEffect(() => {
//     if (
//       profileType === "employer" &&
//       profile &&
//       "rooms" in profile &&
//       canvasRef.current
//     ) {
//       const c = new fabric.Canvas(canvasRef.current, {
//         width: 500,
//         height: 400,
//         backgroundColor: "#f0f0f0",
//       });

//       if (profile.rooms) {
//         profile.rooms.forEach((room, index) => {
//           if (room.position) {
//             const rect = new fabric.Rect({
//               left: 0,
//               top: 0,
//               width: room.position.width,
//               height: room.position.height,
//               fill: "rgba(100, 100, 255, 0.5)",
//             });
//             const text = new fabric.Text(room.type, {
//               left: 10,
//               top: 10,
//               fontSize: 20,
//               fill: "white",
//             });
//             const group = new fabric.Group([rect, text], {
//               left: room.position.x,
//               top: room.position.y,
//               selectable: false,
//             });
//             group.set("data", {
//               type: room.type,
//               instructions: room.instructions,
//             });
//             c.add(group);
//           } else {
//             console.warn(`Room at index ${index} has no position data:`, room);
//           }
//         });
//         c.renderAll();
//         console.log("Canvas initialized with rooms:", profile.rooms);
//       }

//       return () => {
//         c.dispose();
//       };
//     }
//   }, [profile, profileType]);

//   if (loading) {
//     return (
//       <div className="container mx-auto py-8 flex justify-center items-center min-h-[200px]">
//         <PulseLoader color="#36d7b7" />
//       </div>
//     );
//   }

//   if (!profile || !profileType) return null;

//   const isOwnProfile = user?.id === params.id;

//   return (
//     <div className="container mx-auto py-8">
//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle>{profile.name}&#39;s Profile</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground">
//             Address: {profile.address || "Unknown"}
//           </p>
//           {profile.image && (
//             <img
//               src={profile.image}
//               alt={profile.name}
//               className="w-24 h-24 rounded-full object-cover mt-2"
//               onError={(e) => (e.currentTarget.src = "/placeholder.png")}
//             />
//           )}
//           {profileType === "worker" && "strengths" in profile && (
//             <>
//               <p className="text-sm text-muted-foreground mt-2">
//                 Strengths: {profile.strengths || "N/A"}
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 Availability: {profile.availability || "N/A"}
//               </p>
//             </>
//           )}
//           {profileType === "employer" && "rooms" in profile && (
//             <div className="mt-4">
//               <h3 className="text-lg font-semibold">House Layout</h3>
//               <canvas ref={canvasRef} className="border border-gray-300" />
//               <InstructionTranslator rooms={profile.rooms || []} />
//             </div>
//           )}
//           <div className="mt-4">
//             <MapDisplay
//               location={JSON.stringify({
//                 address: profile.address,
//                 coordinates: profile.coordinates,
//               })}
//               name={profile.name}
//             />
//           </div>
//           <div className="mt-4 flex gap-4">
//             {isOwnProfile ? (
//               <Button onClick={() => router.push("/profile")}>
//                 Edit Profile
//               </Button>
//             ) : (
//               <Button
//                 onClick={() => toast.info("Contact feature coming soon!")}
//               >
//                 Contact {profile.name}
//               </Button>
//             )}
//             <Button
//               variant="outline"
//               onClick={() =>
//                 router.push(
//                   profileType === "employer" ? "/employers" : "/workers"
//                 )
//               }
//             >
//               Back to {profileType === "employer" ? "Employers" : "Workers"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PulseLoader } from "react-spinners";
import { toast } from "sonner";
import { motion } from "framer-motion";
import MapDisplay from "@/components/MapDisplay";
import InstructionTranslator from "@/components/InstructionTranslator";
import {
  getEmployerByClerkId,
  getWorkerByClerkId,
  Employer,
  Worker,
} from "@/actions/profiles";
import * as fabric from "fabric";

declare module "fabric" {
  interface Group {
    data?: { type: string; instructions: string };
  }
}

export default function ViewProfile({ params }: { params: { id: string } }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<Employer | Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState<"employer" | "worker" | null>(
    null
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoaded) return;
      if (!user) {
        toast.error("Please sign in to view profiles.");
        router.push("/sign-in");
        return;
      }
      setLoading(true);
      try {
        const [employer, worker] = await Promise.all([
          getEmployerByClerkId(params.id),
          getWorkerByClerkId(params.id),
        ]);
        if (employer) {
          setProfile(employer);
          setProfileType("employer");
        } else if (worker) {
          setProfile(worker);
          setProfileType("worker");
        } else {
          toast.error("Profile not found.");
          router.push("/employers");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, isLoaded, params.id, router]);

  useEffect(() => {
    if (
      profileType === "employer" &&
      profile &&
      "rooms" in profile &&
      canvasRef.current
    ) {
      const c = new fabric.Canvas(canvasRef.current, {
        width: 500,
        height: 400,
        backgroundColor: "#2a1a4a",
      });

      if ("rooms" in profile && profile.rooms) {
        profile.rooms.forEach((room, index: number) => {
          if (room.position) {
            const rect = new fabric.Rect({
              left: 0,
              top: 0,
              width: room.position.width,
              height: room.position.height,
              fill: "rgba(100, 100, 255, 0.5)",
            });
            const text = new fabric.Text(room.type, {
              left: 10,
              top: 10,
              fontSize: 20,
              fill: "white",
            });
            const group = new fabric.Group([rect, text], {
              left: room.position.x,
              top: room.position.y,
              selectable: false,
            });
            group.set("data", {
              type: room.type,
              instructions: room.instructions,
            });
            c.add(group);
          } else {
            console.warn(`Room at index ${index} has no position data:`, room);
          }
        });
        c.renderAll();
        console.log("Canvas initialized with rooms:", profile.rooms);
      }

      return () => {
        c.dispose();
      };
    }
  }, [profile, profileType]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[200px] bg-gradient-to-br from-purple-900 to-indigo-900">
        <PulseLoader color="#a78bfa" />
      </div>
    );
  }

  if (!profile || !profileType) return null;

  const isOwnProfile = user?.id === params.id;

  return (
    <div className="container mx-auto py-8 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-purple-800 to-indigo-800 text-white shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {profile.name}&#39;s Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.image && (
              <div className="flex justify-center">
                <motion.img
                  src={profile.image}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full object-cover mt-2 border-2 border-purple-300"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            )}
            <p className="text-sm text-purple-200 text-center">
              Address: {profile.address || "Unknown"}
            </p>
            {profileType === "worker" && "strengths" in profile && (
              <>
                <p className="text-sm text-purple-200 text-center">
                  Strengths: {profile.strengths || "N/A"}
                </p>
                <p className="text-sm text-purple-200 text-center">
                  Availability: {profile.availability || "N/A"}
                </p>
              </>
            )}
            {profileType === "employer" && "rooms" in profile && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-purple-100 text-center">
                  House Layout
                </h3>
                <canvas
                  ref={canvasRef}
                  className="border border-purple-500 rounded-lg shadow-md"
                />
                <InstructionTranslator rooms={profile.rooms || []} />
              </motion.div>
            )}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <MapDisplay
                location={JSON.stringify({
                  address: profile.address,
                  coordinates: profile.coordinates,
                })}
                name={profile.name}
              />
            </motion.div>
            <div className="mt-4 flex gap-4 justify-center">
              {isOwnProfile ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => router.push("/profile")}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Edit Profile
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => toast.info("Contact feature coming soon!")}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Contact {profile.name}
                  </Button>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(
                      profileType === "employer" ? "/employers" : "/workers"
                    )
                  }
                  className="border-purple-400 text-purple-200 hover:bg-purple-700 hover:text-white"
                >
                  Back to {profileType === "employer" ? "Employers" : "Workers"}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
