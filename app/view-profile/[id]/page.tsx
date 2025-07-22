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

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { PulseLoader } from "react-spinners";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
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
//         backgroundColor: "#2a1a4a",
//       });

//       if ("rooms" in profile && profile.rooms) {
//         profile.rooms.forEach((room, index: number) => {
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
//       <div className="container mx-auto py-8 flex justify-center items-center min-h-[200px] bg-gradient-to-br from-purple-900 to-indigo-900">
//         <PulseLoader color="#a78bfa" />
//       </div>
//     );
//   }

//   if (!profile || !profileType) return null;

//   const isOwnProfile = user?.id === params.id;

//   return (
//     <div className="container mx-auto py-8 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         <Card className="max-w-2xl mx-auto bg-gradient-to-br from-purple-800 to-indigo-800 text-white shadow-xl border-0">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-center">
//               {profile.name}&#39;s Profile
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {profile.image && (
//               <div className="flex justify-center">
//                 <motion.img
//                   src={profile.image}
//                   alt={profile.name}
//                   className="w-32 h-32 rounded-full object-cover mt-2 border-2 border-purple-300"
//                   onError={(e) => (e.currentTarget.src = "/placeholder.png")}
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ duration: 0.4, ease: "easeOut" }}
//                 />
//               </div>
//             )}
//             <p className="text-sm text-purple-200 text-center">
//               Address: {profile.address || "Unknown"}
//             </p>
//             {profileType === "worker" && "strengths" in profile && (
//               <>
//                 <p className="text-sm text-purple-200 text-center">
//                   Strengths: {profile.strengths || "N/A"}
//                 </p>
//                 <p className="text-sm text-purple-200 text-center">
//                   Availability: {profile.availability || "N/A"}
//                 </p>
//               </>
//             )}
//             {profileType === "employer" && "rooms" in profile && (
//               <motion.div
//                 className="mt-4"
//                 initial={{ opacity: 0, x: -50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//               >
//                 <h3 className="text-lg font-semibold text-purple-100 text-center">
//                   House Layout
//                 </h3>
//                 <canvas
//                   ref={canvasRef}
//                   className="border border-purple-500 rounded-lg shadow-md"
//                 />
//                 <InstructionTranslator rooms={profile.rooms || []} />
//               </motion.div>
//             )}
//             <motion.div
//               className="mt-4"
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//             >
//               <MapDisplay
//                 location={JSON.stringify({
//                   address: profile.address,
//                   coordinates: profile.coordinates,
//                 })}
//                 name={profile.name}
//               />
//             </motion.div>
//             <div className="mt-4 flex gap-4 justify-center">
//               {isOwnProfile ? (
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Button
//                     onClick={() => router.push("/profile")}
//                     className="bg-purple-600 hover:bg-purple-700 text-white"
//                   >
//                     Edit Profile
//                   </Button>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Button
//                     onClick={() => toast.info("Contact feature coming soon!")}
//                     className="bg-purple-600 hover:bg-purple-700 text-white"
//                   >
//                     Contact {profile.name}
//                   </Button>
//                 </motion.div>
//               )}
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Button
//                   variant="outline"
//                   onClick={() =>
//                     router.push(
//                       profileType === "employer" ? "/employers" : "/workers"
//                     )
//                   }
//                   className="border-purple-400 text-purple-200 hover:bg-purple-700 hover:text-white"
//                 >
//                   Back to {profileType === "employer" ? "Employers" : "Workers"}
//                 </Button>
//               </motion.div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import { getEmployerByClerkId, getWorkerByClerkId } from "@/actions/profiles";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import MapDisplay from "@/components/MapDisplay";
// import InstructionTranslator from "@/components/InstructionTranslator";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { parseLocationName } from "@/lib/locationUtils";
// import * as fabric from "fabric";
// import { Mail, Phone } from "lucide-react";

// declare module "fabric" {
//   interface Group {
//     data?: { type: string; instructions: string };
//   }
// }

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

// interface Worker {
//   id: number;
//   userId: number;
//   name: string;
//   image: string | null;
//   address: string;
//   coordinates: { lat: number; lng: number } | null;
//   strengths: string | null;
//   availability: string | null;
//   contactNumber: string | null;
//   email: string | null;
//   experienceLevel: "Beginner" | "Intermediate" | "Expert" | null;
//   preferredWorkTypes: string[] | null;
//   references: Reference[] | null;
//   createdAt: Date | null;
//   clerkUserId: string;
// }

// interface Employer {
//   id: number;
//   userId: number;
//   name: string;
//   image: string | null;
//   address: string;
//   coordinates: { lat: number; lng: number } | null;
//   rooms: Room[] | null;
//   contactNumber: string | null;
//   email: string | null;
//   preferredSchedule: string | null;
//   additionalNotes: string | null;
//   createdAt: Date | null;
//   clerkUserId: string;
// }

// // Type guard to check if profile is Worker
// function isWorker(profile: Worker | Employer): profile is Worker {
//   return (profile as Worker).strengths !== undefined;
// }

// export default function ViewProfile({ params }: { params: { id: string } }) {
//   const { user } = useUser();
//   const router = useRouter();
//   const [profile, setProfile] = useState<Worker | Employer | null>(null);
//   const [profileType, setProfileType] = useState<"worker" | "employer" | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!params.id || typeof params.id !== "string") {
//         toast.error("Invalid profile ID.");
//         router.push("/");
//         return;
//       }

//       try {
//         setLoading(true);
//         const [worker, employer] = await Promise.all([
//           getWorkerByClerkId(params.id),
//           getEmployerByClerkId(params.id),
//         ]);

//         if (worker) {
//           setProfile(worker);
//           setProfileType("worker");
//         } else if (employer) {
//           setProfile(employer);
//           setProfileType("employer");
//         } else {
//           toast.error("Profile not found.");
//           router.push("/");
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         toast.error("Failed to load profile.");
//         router.push("/");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [params.id, router]);

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
//         backgroundColor: "#2a1a4a",
//       });

//       if ("rooms" in profile && profile.rooms) {
//         profile.rooms.forEach((room, index: number) => {
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
//       }

//       return () => {
//         c.dispose();
//       };
//     }
//   }, [profile, profileType]);

//   // Sanitize email and phone to prevent injection
//   const sanitizeContact = (value: string | null): string | null => {
//     if (!value) return null;
//     // Basic sanitization to remove potentially harmful characters
//     return value.replace(/[<>"]/g, "");
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto py-8 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen flex justify-center items-center">
//         <p className="text-white">Loading...</p>
//       </div>
//     );
//   }

//   if (!profile || !profileType) {
//     return (
//       <div className="container mx-auto py-8 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen flex justify-center items-center">
//         <p className="text-white">Profile not found.</p>
//       </div>
//     );
//   }

//   const isOwnProfile = user && user.id === params.id;
//   const sanitizedEmail = sanitizeContact(profile.email);
//   const sanitizedContactNumber = sanitizeContact(profile.contactNumber);

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
//               {profile.name}&apos;s Profile
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {profile.image && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="flex justify-center"
//               >
//                 <img
//                   src={profile.image}
//                   alt={profile.name}
//                   className="w-32 h-32 rounded-full object-cover"
//                   onError={(e) => (e.currentTarget.src = "/placeholder.png")}
//                 />
//               </motion.div>
//             )}
//             <div>
//               <p className="text-sm text-purple-200">
//                 <strong>Location:</strong> {parseLocationName(profile.address)}
//               </p>
//               {profileType === "worker" && isWorker(profile) && (
//                 <>
//                   {sanitizedContactNumber && !isOwnProfile && (
//                     <div className="flex items-center gap-2 text-sm text-purple-200">
//                       <Phone className="h-4 w-4" />
//                       <a
//                         href={`tel:${sanitizedContactNumber}`}
//                         className="text-purple-400 hover:underline"
//                       >
//                         Call: {sanitizedContactNumber}
//                       </a>
//                     </div>
//                   )}
//                   {sanitizedEmail && !isOwnProfile && (
//                     <div className="flex items-center gap-2 text-sm text-purple-200">
//                       <Mail className="h-4 w-4" />
//                       <a
//                         href={`mailto:${sanitizedEmail}`}
//                         className="text-purple-400 hover:underline"
//                       >
//                         Email: {sanitizedEmail}
//                       </a>
//                     </div>
//                   )}
//                   {profile.strengths && (
//                     <p className="text-sm text-purple-200">
//                       <strong>Strengths:</strong> {profile.strengths}
//                     </p>
//                   )}
//                   {profile.availability && (
//                     <p className="text-sm text-purple-200">
//                       <strong>Availability:</strong> {profile.availability}
//                     </p>
//                   )}
//                   {profile.experienceLevel && (
//                     <p className="text-sm text-purple-200">
//                       <strong>Experience:</strong> {profile.experienceLevel}
//                     </p>
//                   )}
//                   {profile.preferredWorkTypes &&
//                     profile.preferredWorkTypes.length > 0 && (
//                       <p className="text-sm text-purple-200">
//                         <strong>Work Types:</strong>{" "}
//                         {profile.preferredWorkTypes.join(", ")}
//                       </p>
//                     )}
//                   {profile.references && profile.references.length > 0 && (
//                     <div className="text-sm text-purple-200">
//                       <strong>References:</strong>
//                       <ul className="list-disc pl-5">
//                         {profile.references.map((ref, idx) => (
//                           <li key={idx}>
//                             {ref.name} ({ref.contact}): {ref.testimonial}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </>
//               )}
//               {profileType === "employer" && "rooms" in profile && (
//                 <>
//                   {sanitizedContactNumber && !isOwnProfile && (
//                     <div className="flex items-center gap-2 text-sm text-purple-200">
//                       <Phone className="h-4 w-4" />
//                       <a
//                         href={`tel:${sanitizedContactNumber}`}
//                         className="text-purple-400 hover:underline"
//                       >
//                         Call: {sanitizedContactNumber}
//                       </a>
//                     </div>
//                   )}
//                   {sanitizedEmail && !isOwnProfile && (
//                     <div className="flex items-center gap-2 text-sm text-purple-200">
//                       <Mail className="h-4 w-4" />
//                       <a
//                         href={`mailto:${sanitizedEmail}`}
//                         className="text-purple-400 hover:underline"
//                       >
//                         Email: {sanitizedEmail}
//                       </a>
//                     </div>
//                   )}
//                   {profile.preferredSchedule && (
//                     <p className="text-sm text-purple-200">
//                       <strong>Preferred Schedule:</strong>{" "}
//                       {profile.preferredSchedule}
//                     </p>
//                   )}
//                   {profile.additionalNotes && (
//                     <p className="text-sm text-purple-200">
//                       <strong>Additional Notes:</strong>{" "}
//                       {profile.additionalNotes}
//                     </p>
//                   )}
//                   {profile.rooms && profile.rooms.length > 0 && (
//                     <div className="text-sm text-purple-200">
//                       <strong>House Layout Instructions:</strong>
//                       <canvas
//                         ref={canvasRef}
//                         className="border border-purple-500 rounded-lg shadow-md mt-2"
//                       />
//                       <InstructionTranslator rooms={profile.rooms} />
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//             {profile.coordinates ? (
//               <MapDisplay
//                 location={JSON.stringify({
//                   address: parseLocationName(profile.address),
//                   coordinates: profile.coordinates,
//                 })}
//                 name={profile.name}
//               />
//             ) : (
//               <p className="text-sm text-purple-200">
//                 Location coordinates not available
//               </p>
//             )}
//             <div className="flex gap-4 justify-center">
//               {isOwnProfile ? (
//                 <Button
//                   onClick={() => router.push("/profile")}
//                   className="bg-purple-600 hover:bg-purple-700 text-white"
//                 >
//                   Edit Profile
//                 </Button>
//               ) : (
//                 <>
//                   {!sanitizedEmail && !sanitizedContactNumber && (
//                     <Button
//                       onClick={() =>
//                         toast.info("No contact information available.")
//                       }
//                       className="bg-purple-600 hover:bg-purple-700 text-white"
//                     >
//                       Contact {profile.name}
//                     </Button>
//                   )}
//                 </>
//               )}
//               <Button
//                 variant="outline"
//                 onClick={() =>
//                   router.push(
//                     profileType === "employer" ? "/employers" : "/workers"
//                   )
//                 }
//                 className="border-purple-400 text-purple-200 hover:bg-purple-700 hover:text-white"
//               >
//                 Back to {profileType === "employer" ? "Employers" : "Workers"}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }
// [id]/page.tsx

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { motion } from "framer-motion";
// import { getEmployerByClerkId, getWorkerByClerkId } from "@/actions/profiles";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import MapDisplay from "@/components/MapDisplay";
// import InstructionTranslator from "@/components/InstructionTranslator";
// import HouseView from "@/components/HouseView";
// import { parseLocationName } from "@/lib/locationUtils";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { SignedIn, SignedOut } from "@clerk/nextjs";
// import Link from "next/link";

// interface Room {
//   type: string;
//   instructions: string;
//   position?: { x: number; y: number; width: number; height: number };
// }

// interface Profile {
//   id: number;
//   clerkUserId: string;
//   name: string;
//   image?: string | null;
//   profileType: "employer" | "worker";
//   address: string;
//   coordinates: { lat: number; lng: number } | null;
//   rooms?: Room[] | null;
//   strengths?: string | null;
//   availability?: string | null;
//   contactNumber?: string | null;
//   email?: string | null;
//   preferredSchedule?: string | null;
//   additionalNotes?: string | null;
//   experienceLevel?: "Beginner" | "Intermediate" | "Expert" | null;
//   preferredWorkTypes?: string[] | null;
//   references?: { name: string; contact: string; testimonial: string }[] | null;
// }

// export default function ProfilePage({ params }: { params: { id: string } }) {
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [translatedRooms, setTranslatedRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [targetLanguage, setTargetLanguage] = useState<string>("en");
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!params.id || typeof params.id !== "string") {
//         toast.error("Invalid profile ID.");
//         router.push("/");
//         return;
//       }

//       try {
//         setLoading(true);
//         const [employer, worker] = await Promise.all([
//           getEmployerByClerkId(params.id),
//           getWorkerByClerkId(params.id),
//         ]);

//         if (employer) {
//           setProfile({ ...employer, profileType: "employer" });
//           setTranslatedRooms(employer.rooms || []);
//         } else if (worker) {
//           setProfile({ ...worker, profileType: "worker" });
//         } else {
//           toast.error("Profile not found.");
//           router.push("/");
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         toast.error("Failed to load profile.");
//         router.push("/");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [params.id, router]);

//   // Handle language change and fetch translations
//   const handleLanguageChange = async (
//     language: string,
//     newTranslatedRooms: Room[]
//   ) => {
//     setTargetLanguage(language);
//     setTranslatedRooms(newTranslatedRooms);
//     // Update URL with new language
//     const newSearchParams = new URLSearchParams(searchParams);
//     newSearchParams.set("lang", language);
//     router.push(`/view-profile/${params.id}?${newSearchParams.toString()}`);
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto py-8 flex justify-center items-center min-h-screen">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (!profile) {
//     return null;
//   }

//   return (
//     <div className="mx-auto py-8 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="max-w-3xl mx-auto"
//       >
//         <Card className="bg-gradient-to-br from-purple-800 to-indigo-800 text-white shadow-xl border-0">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-purple-100">
//               {profile.name}&apos;s Profile
//             </CardTitle>
//             <p className="text-sm text-purple-200">
//               {profile.profileType === "employer" ? "Employer" : "Worker"}
//             </p>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {profile.image && (
//               <div className="flex justify-center">
//                 <img
//                   src={profile.image}
//                   alt={profile.name}
//                   className="w-32 h-32 rounded-full object-cover mb-4"
//                   onError={(e) => (e.currentTarget.src = "/placeholder.png")}
//                 />
//               </div>
//             )}

//             <div>
//               <h3 className="text-lg font-semibold text-purple-200">
//                 Location
//               </h3>
//               <p className="text-sm text-gray-300">
//                 {parseLocationName(profile.address)}
//               </p>
//               {profile.coordinates ? (
//                 <MapDisplay
//                   location={JSON.stringify({
//                     address: profile.address,
//                     coordinates: profile.coordinates,
//                   })}
//                   name={profile.name}
//                 />
//               ) : (
//                 <p className="text-sm text-purple-200">
//                   Location coordinates not available
//                 </p>
//               )}
//             </div>

//             {profile.profileType === "employer" && (
//               <>
//                 {profile.rooms && profile.rooms.length > 0 && (
//                   <div>
//                     <HouseView rooms={translatedRooms} />
//                     <SignedIn>
//                       <InstructionTranslator
//                         rooms={profile.rooms}
//                         onLanguageChange={handleLanguageChange}
//                       />
//                     </SignedIn>
//                   </div>
//                 )}
//                 {profile.contactNumber && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-purple-200">
//                       Contact Number
//                     </h3>
//                     <a
//                       href={`tel:${profile.contactNumber}`}
//                       className="text-sm text-purple-300 hover:text-purple-100 underline transition-colors"
//                     >
//                       {profile.contactNumber}
//                     </a>
//                   </div>
//                 )}
//                 {profile.email && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-purple-200">
//                       Email
//                     </h3>
//                     <a
//                       href={`mailto:${profile.email}`}
//                       className="text-sm text-purple-300 hover:text-purple-100 underline transition-colors"
//                     >
//                       {profile.email}
//                     </a>
//                   </div>
//                 )}
//                 {profile.preferredSchedule && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-purple-200">
//                       Preferred Schedule
//                     </h3>
//                     <p className="text-sm text-gray-300">
//                       {profile.preferredSchedule}
//                     </p>
//                   </div>
//                 )}
//                 {profile.additionalNotes && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-purple-200">
//                       Additional Notes
//                     </h3>
//                     <p className="text-sm text-gray-300">
//                       {profile.additionalNotes}
//                     </p>
//                   </div>
//                 )}
//               </>
//             )}

//             {profile.profileType === "worker" && (
//               <>
//                 {profile.strengths && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-purple-200">
//                       Strengths
//                     </h3>
//                     <p className="text-sm text-gray-300">{profile.strengths}</p>
//                   </div>
//                 )}
//                 {profile.availability && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-purple-200">
//                       Availability
//                     </h3>
//                     <p className="text-sm text-gray-300">
//                       {profile.availability}
//                     </p>
//                   </div>
//                 )}
//                 {profile.contactNumber && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-purple-200">
//                       Contact Number
//                     </h3>
//                     <a
//                       href={`tel:${profile.contactNumber}`}
//                       className="text-sm text-purple-300 hover:text-purple-100 underline transition-colors"
//                     >
//                       {profile.contactNumber}
//                     </a>
//                   </div>
//                 )}
//                 {profile.email && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-purple-200">
//                       Email
//                     </h3>
//                     <a
//                       href={`mailto:${profile.email}`}
//                       className="text-sm text-purple-300 hover:text-purple-100 underline transition-colors"
//                     >
//                       {profile.email}
//                     </a>
//                   </div>
//                 )}
//                 {profile.experienceLevel && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-purple-200">
//                       Experience Level
//                     </h3>
//                     <p className="text-sm text-gray-300">
//                       {profile.experienceLevel}
//                     </p>
//                   </div>
//                 )}
//                 {profile.preferredWorkTypes &&
//                   profile.preferredWorkTypes.length > 0 && (
//                     <div>
//                       <h3 className="text-lg font-semibold text-purple-200">
//                         Preferred Work Types
//                       </h3>
//                       <p className="text-sm text-gray-300">
//                         {profile.preferredWorkTypes.join(", ")}
//                       </p>
//                     </div>
//                   )}
//                 {profile.references && profile.references.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-purple-200">
//                       References
//                     </h3>
//                     {profile.references.map((ref, index) => (
//                       <div
//                         key={index}
//                         className="my-2 p-4 bg-purple-950/20 rounded-lg shadow-md border border-purple-400 transform transition-all hover:shadow-lg hover:scale-105"
//                       >
//                         <p className="text-sm text-purple-100">
//                           <strong>{ref.name}</strong> (
//                           <a
//                             href={`tel:${ref.contact}`}
//                             className="text-purple-300 hover:text-purple-100 underline transition-colors"
//                           >
//                             {ref.contact}
//                           </a>
//                           ): {ref.testimonial}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}

//             <SignedOut>
//               <Link href="/sign-in">
//                 <Button variant="outline" className="mt-4">
//                   Sign In to Translate Instructions
//                 </Button>
//               </Link>
//             </SignedOut>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getEmployerByClerkId, getWorkerByClerkId } from "@/actions/profiles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MapDisplay from "@/components/MapDisplay";
import InstructionTranslator from "@/components/InstructionTranslator";
import HouseView from "@/components/HouseView";
import { parseLocationName } from "@/lib/locationUtils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import MotionWrapperDelay from "@/components/MotionWrapperDelay";

interface Room {
  type: string;
  instructions: string;
  position?: { x: number; y: number; width: number; height: number };
}

interface Profile {
  id: number;
  clerkUserId: string;
  name: string;
  image?: string | null;
  profileType: "employer" | "worker";
  address: string;
  coordinates: { lat: number; lng: number } | null;
  rooms?: Room[] | null;
  strengths?: string | null;
  availability?: string | null;
  contactNumber?: string | null;
  email?: string | null;
  preferredSchedule?: string | null;
  additionalNotes?: string | null;
  experienceLevel?: "Beginner" | "Intermediate" | "Expert" | null;
  preferredWorkTypes?: string[] | null;
  references?: { name: string; contact: string; testimonial: string }[] | null;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [translatedRooms, setTranslatedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!params.id || typeof params.id !== "string") {
        toast.error("Invalid profile ID.");
        router.push("/");
        return;
      }

      try {
        setLoading(true);
        const [employer, worker] = await Promise.all([
          getEmployerByClerkId(params.id),
          getWorkerByClerkId(params.id),
        ]);

        if (employer) {
          setProfile({ ...employer, profileType: "employer" });
          setTranslatedRooms(employer.rooms || []);
        } else if (worker) {
          setProfile({ ...worker, profileType: "worker" });
        } else {
          toast.error("Profile not found.");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile.");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id, router]);

  // Handle language change and fetch translations
  const handleLanguageChange = async (
    language: string,
    newTranslatedRooms: Room[]
  ) => {
    setTranslatedRooms(newTranslatedRooms);
    // Update URL with new language
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("lang", language);
    router.push(`/view-profile/${params.id}?${newSearchParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="mx-auto py-8 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-purple-800 to-indigo-800 text-white shadow-xl border-0">
          <CardHeader>
            <MotionWrapperDelay
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              variants={{
                hidden: { opacity: 0, y: -100 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <CardTitle className="text-4xl font-bold gradient-title text-purple-100 text-center">
                {profile.name}&apos;s Profile
              </CardTitle>
            </MotionWrapperDelay>
            <MotionWrapperDelay
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              variants={{
                hidden: { opacity: 0, x: 100 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <p className="text-lg text-purple-200 text-center">
                {profile.profileType === "employer" ? "Employer" : "Worker"}
              </p>
            </MotionWrapperDelay>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile.image && (
              <div className="flex justify-center">
                <MotionWrapperDelay
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  variants={{
                    hidden: { opacity: 0, y: -100 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                </MotionWrapperDelay>
              </div>
            )}

            <div>
              <MotionWrapperDelay
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                variants={{
                  hidden: { opacity: 0, x: -100 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <h3 className="text-2xl font-semibold text-purple-200 text-center mb-4">
                  Location
                </h3>
              </MotionWrapperDelay>

              <MotionWrapperDelay
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                variants={{
                  hidden: { opacity: 0, y: 100 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <p className="text-sm text-gray-300 text-center mb-4 gradient-background2 rounded-lg p-3">
                  {parseLocationName(profile.address)}
                </p>
              </MotionWrapperDelay>

              {profile.coordinates ? (
                <MapDisplay
                  location={JSON.stringify({
                    address: profile.address,
                    coordinates: profile.coordinates,
                  })}
                  name={profile.name}
                />
              ) : (
                <p className="text-sm text-purple-200">
                  Location coordinates not available
                </p>
              )}
            </div>

            {profile.profileType === "employer" && (
              <>
                {profile.rooms && profile.rooms.length > 0 && (
                  <div>
                    <HouseView rooms={translatedRooms} />
                    <SignedIn>
                      <InstructionTranslator
                        rooms={profile.rooms}
                        onLanguageChange={handleLanguageChange}
                      />
                    </SignedIn>
                  </div>
                )}
                {profile.contactNumber && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-200">
                      Contact Number
                    </h3>
                    <a
                      href={`tel:${profile.contactNumber}`}
                      className="text-sm text-purple-300 hover:text-purple-100 underline transition-colors"
                    >
                      {profile.contactNumber}
                    </a>
                  </div>
                )}
                {profile.email && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-200">
                      Email
                    </h3>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm text-purple-300 hover:text-purple-100 underline transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.preferredSchedule && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-200">
                      Preferred Schedule
                    </h3>
                    <p className="my-2 p-4 bg-purple-950/20 rounded-lg shadow-md border border-purple-400 transform transition-all hover:shadow-lg hover:scale-105">
                      {profile.preferredSchedule}
                    </p>
                  </div>
                )}
                {profile.additionalNotes && (
                  <div>
                    <MotionWrapperDelay
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      variants={{
                        hidden: { opacity: 0, y: 100 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <h3 className="text-lg font-semibold text-purple-200">
                        Additional Notes
                      </h3>
                    </MotionWrapperDelay>

                    <p className="my-2 p-4 bg-purple-950/20 rounded-lg shadow-md border border-purple-400 transform transition-all hover:shadow-lg hover:scale-105">
                      {profile.additionalNotes}
                    </p>
                  </div>
                )}
              </>
            )}

            {profile.profileType === "worker" && (
              <>
                {profile.strengths && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-200">
                      Strengths
                    </h3>
                    <p className="my-2 p-4 bg-purple-950/20 rounded-lg shadow-md border border-purple-400 transform transition-all hover:shadow-lg hover:scale-105">
                      {profile.strengths}
                    </p>
                  </div>
                )}
                {profile.availability && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-200">
                      Availability
                    </h3>
                    <p className="my-2 p-4 bg-purple-950/20 rounded-lg shadow-md border border-purple-400 transform transition-all hover:shadow-lg hover:scale-105">
                      {profile.availability}
                    </p>
                  </div>
                )}
                {profile.contactNumber && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-200">
                      Contact Number
                    </h3>
                    <a
                      href={`tel:${profile.contactNumber}`}
                      className="text-sm text-purple-300 hover:text-purple-100 underline transition-colors"
                    >
                      {profile.contactNumber}
                    </a>
                  </div>
                )}
                {profile.email && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-200">
                      Email
                    </h3>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm text-purple-300 hover:text-purple-100 underline transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.experienceLevel && (
                  <div>
                    <MotionWrapperDelay
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      variants={{
                        hidden: { opacity: 0, y: 100 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      {" "}
                      <h3 className="text-lg font-semibold text-purple-200">
                        Experience Level
                      </h3>
                    </MotionWrapperDelay>

                    <p className="my-2 p-4 bg-purple-950/20 rounded-lg shadow-md border border-purple-400 transform transition-all hover:shadow-lg hover:scale-105">
                      {profile.experienceLevel}
                    </p>
                  </div>
                )}
                {profile.preferredWorkTypes &&
                  profile.preferredWorkTypes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-purple-200">
                        Preferred Work Types
                      </h3>
                      <p className="my-2 p-4 bg-purple-950/20 rounded-lg shadow-md border border-purple-400 transform transition-all hover:shadow-lg hover:scale-105">
                        {profile.preferredWorkTypes.join(", ")}
                      </p>
                    </div>
                  )}
                {profile.references && profile.references.length > 0 && (
                  <div>
                    <MotionWrapperDelay
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      variants={{
                        hidden: { opacity: 0, x: 100 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      {" "}
                      <h3 className="text-lg font-semibold text-purple-200">
                        References
                      </h3>
                    </MotionWrapperDelay>

                    {profile.references.map((ref, index) => (
                      <div
                        key={index}
                        className="my-2 p-4 bg-purple-950/20 rounded-lg shadow-md border border-purple-400 transform transition-all hover:shadow-lg hover:scale-105"
                      >
                        <p className="text-sm text-purple-100">
                          <strong>{ref.name}</strong> (
                          <a
                            href={`tel:${ref.contact}`}
                            className="text-purple-300 hover:text-purple-100 underline transition-colors"
                          >
                            {ref.contact}
                          </a>
                          ): {ref.testimonial}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            <SignedOut>
              <Link href="/sign-in">
                <Button variant="outline" className="mt-4">
                  Sign In to Translate Instructions
                </Button>
              </Link>
            </SignedOut>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
