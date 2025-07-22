// "use client";

// import { useState, useEffect } from "react";
// import { SignedOut } from "@clerk/nextjs";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { PulseLoader } from "react-spinners";
// import SearchBar from "@/components/SearchBar";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { getAllWorkers } from "@/actions/profiles";

// type WorkerProfile = {
//   id: number;
//   name: string;
//   image: string | null;
//   address: string;
//   strengths: string | null;
//   availability: string | null;
//   clerkUserId: string;
// };

// export default function WorkersPage() {
//   const [workerProfiles, setWorkerProfiles] = useState<{
//     profiles: WorkerProfile[];
//     totalPages: number;
//     currentPage: number;
//   }>({
//     profiles: [],
//     totalPages: 1,
//     currentPage: 1,
//   });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);

//   const fetchProfiles = async (query = "", page = 1) => {
//     setLoading(true);
//     try {
//       const workers = await getAllWorkers(query, page);
//       setWorkerProfiles(workers);
//     } catch (error) {
//       console.error("Error fetching workers:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(
//       () => fetchProfiles(searchQuery, page),
//       300
//     );
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchQuery, page]);

//   return (
//     <div className="container mx-auto py-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <h1 className="text-3xl font-bold mb-6">Workers</h1>
//         <SearchBar
//           placeholder="Search workers by name or address..."
//           value={searchQuery}
//           onChange={(e) => {
//             setSearchQuery(e.target.value);
//             setPage(1);
//           }}
//         />
//         <SignedOut>
//           <Link href="/sign-in">
//             <Button variant="outline" className="mb-4">
//               Sign In
//             </Button>
//           </Link>
//         </SignedOut>
//         {loading ? (
//           <div className="flex justify-center items-center min-h-[200px]">
//             <PulseLoader color="#36d7b7" />
//           </div>
//         ) : (
//           <>
//             <motion.div
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//               initial="hidden"
//               animate="visible"
//               variants={{
//                 hidden: { opacity: 0 },
//                 visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
//               }}
//             >
//               {workerProfiles.profiles.map((worker) => (
//                 <motion.div
//                   key={worker.id}
//                   variants={{
//                     hidden: { opacity: 0, y: 20 },
//                     visible: { opacity: 1, y: 0 },
//                   }}
//                   transition={{ duration: 0.4 }}
//                 >
//                   <Link href={`/view-profile/${worker.clerkUserId}`}>
//                     <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 mt-10 bg-gradient-to-t from-purple-900 via-indigo-500 to-black">
//                       <CardHeader>
//                         <CardTitle className="text-center text-2xl">
//                           {worker.name}
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         {worker.image && (
//                           <div className="flex items-center justify-center">
//                             <img
//                               src={worker.image}
//                               alt={worker.name}
//                               className="w-28 h-28 rounded-full object-cover mb-2"
//                               onError={(e) =>
//                                 (e.currentTarget.src = "/placeholder.png")
//                               }
//                             />
//                           </div>
//                         )}
//                         <p className="text-sm text-muted-foreground">
//                           Address: {worker.address}
//                         </p>
//                         {worker.strengths && (
//                           <p className="text-sm text-muted-foreground">
//                             Strengths: {worker.strengths}
//                           </p>
//                         )}
//                         {worker.availability && (
//                           <p className="text-sm text-muted-foreground">
//                             Availability: {worker.availability}
//                           </p>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </Link>
//                 </motion.div>
//               ))}
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//               className="mt-12 flex justify-center"
//             >
//               <Pagination>
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious
//                       onClick={() => setPage(page - 1)}
//                       className={
//                         page === 1
//                           ? "pointer-events-none opacity-50"
//                           : "cursor-pointer"
//                       }
//                     />
//                   </PaginationItem>
//                   {Array.from(
//                     { length: workerProfiles.totalPages },
//                     (_, i) => i + 1
//                   ).map((p) => (
//                     <PaginationItem key={p}>
//                       <PaginationLink
//                         onClick={() => setPage(p)}
//                         className={page === p ? "bg-purple-600 text-white" : ""}
//                       >
//                         {p}
//                       </PaginationLink>
//                     </PaginationItem>
//                   ))}
//                   <PaginationItem>
//                     <PaginationNext
//                       onClick={() => setPage(page + 1)}
//                       className={
//                         page === workerProfiles.totalPages
//                           ? "pointer-events-none opacity-50"
//                           : "cursor-pointer"
//                       }
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             </motion.div>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// }

// app/workers/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter, useSearchParams } from "next/navigation";
// import { motion } from "framer-motion";
// import { getAllWorkers, Worker } from "@/actions/profiles";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import Link from "next/link";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { Search } from "lucide-react";
// import { BarLoader } from "react-spinners";

// export default function WorkersPage() {
//   const { user, isLoaded } = useUser();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [workers, setWorkers] = useState<Worker[]>([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isEmployer, setIsEmployer] = useState(false);

//   const page = parseInt(searchParams.get("page") || "1", 10);
//   const query = searchParams.get("query") || "";

//   useEffect(() => {
//     if (!isLoaded || !user) return;

//     const fetchWorkers = async () => {
//       setLoading(true);
//       try {
//         const { profiles, totalPages, currentPage } = await getAllWorkers(
//           query,
//           page,
//           9
//         );
//         setWorkers(profiles);
//         setTotalPages(totalPages);
//         setCurrentPage(currentPage);
//         setSearchQuery(query);

//         // Check if user is an employer to enforce role restrictions
//         const response = await fetch(`/api/profile/${user.id}`);
//         if (response.ok) {
//           const profile = await response.json();
//           setIsEmployer(profile.profileType === "employer");
//         }
//       } catch (error) {
//         console.error("Error fetching workers:", error);
//         toast.error("Failed to load workers. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchWorkers();
//   }, [user, isLoaded, page, query]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     router.push(`/workers?query=${encodeURIComponent(searchQuery)}&page=1`);
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       router.push(
//         `/workers?query=${encodeURIComponent(searchQuery)}&page=${newPage}`
//       );
//     }
//   };

//   return (
//     <div className="container mx-auto py-8 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="max-w-4xl mx-auto"
//       >
//         <Card className="bg-gradient-to-br from-purple-800 to-indigo-800 text-white shadow-xl border-0">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-purple-100">
//               Find Workers
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSearch} className="mb-6">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-4 w-4" />
//                 <Input
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search by name, address, strengths, experience, or work types"
//                   className="pl-10 bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//                 />
//                 <Button
//                   type="submit"
//                   className="ml-2 bg-purple-600 hover:bg-purple-700"
//                 >
//                   Search
//                 </Button>
//               </div>
//             </form>

//             {loading ? (
//               <div className="flex justify-center items-center min-h-[200px]">
//                 <BarLoader color="#a78bfa" width="100%" />
//               </div>
//             ) : workers.length === 0 ? (
//               <p className="text-purple-200">No workers found.</p>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {workers.map((worker, index) => (
//                     <motion.div
//                       key={worker.clerkUserId}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.4, delay: index * 0.1 }}
//                     >
//                       <Card className="bg-purple-950/50 border-purple-400 hover:shadow-xl transition-all duration-300 hover:scale-105">
//                         <CardContent className="p-4">
//                           <div className="flex items-center gap-4 mb-4">
//                             {worker.image && (
//                               <img
//                                 src={worker.image}
//                                 alt={worker.name}
//                                 className="w-16 h-16 rounded-full object-cover"
//                                 onError={(e) =>
//                                   (e.currentTarget.src = "/placeholder.png")
//                                 }
//                               />
//                             )}
//                             <div>
//                               <h3 className="text-lg font-semibold text-purple-100">
//                                 {worker.name}
//                               </h3>
//                               <p className="text-sm text-purple-300">
//                                 {worker.address}
//                               </p>
//                             </div>
//                           </div>
//                           {worker.strengths && (
//                             <p className="text-sm text-purple-200 mb-2">
//                               <strong>Strengths:</strong> {worker.strengths}
//                             </p>
//                           )}
//                           {worker.availability && (
//                             <p className="text-sm text-purple-200 mb-2">
//                               <strong>Availability:</strong>{" "}
//                               {worker.availability}
//                             </p>
//                           )}
//                           {worker.contactNumber && (
//                             <p className="text-sm text-purple-200 mb-2">
//                               <strong>Contact:</strong> {worker.contactNumber}
//                             </p>
//                           )}
//                           {worker.email && (
//                             <p className="text-sm text-purple-200 mb-2">
//                               <strong>Email:</strong> {worker.email}
//                             </p>
//                           )}
//                           {worker.experienceLevel && (
//                             <p className="text-sm text-purple-200 mb-2">
//                               <strong>Experience:</strong>{" "}
//                               {worker.experienceLevel}
//                             </p>
//                           )}
//                           {worker.preferredWorkTypes &&
//                             worker.preferredWorkTypes.length > 0 && (
//                               <p className="text-sm text-purple-200 mb-2">
//                                 <strong>Work Types:</strong>{" "}
//                                 {worker.preferredWorkTypes.join(", ")}
//                               </p>
//                             )}
//                           {worker.references &&
//                             worker.references.length > 0 && (
//                               <div className="text-sm text-purple-200 mb-2">
//                                 <strong>References:</strong>
//                                 <ul className="list-disc pl-5">
//                                   {worker.references.map((ref, idx) => (
//                                     <li key={idx}>
//                                       {ref.name} ({ref.contact}):{" "}
//                                       {ref.testimonial}
//                                     </li>
//                                   ))}
//                                 </ul>
//                               </div>
//                             )}
//                           <Link href={`/view-profile/${worker.clerkUserId}`}>
//                             <Button
//                               className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
//                               disabled={isEmployer}
//                             >
//                               View Profile
//                             </Button>
//                           </Link>
//                         </CardContent>
//                       </Card>
//                     </motion.div>
//                   ))}
//                 </div>
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                   className="mt-12 flex justify-center"
//                 >
//                   <Pagination>
//                     <PaginationContent>
//                       <PaginationItem>
//                         <PaginationPrevious
//                           onClick={() => handlePageChange(currentPage - 1)}
//                           className={
//                             currentPage === 1
//                               ? "pointer-events-none opacity-50"
//                               : "cursor-pointer"
//                           }
//                         />
//                       </PaginationItem>
//                       {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                         (p) => (
//                           <PaginationItem key={p}>
//                             <PaginationLink
//                               onClick={() => handlePageChange(p)}
//                               className={
//                                 currentPage === p
//                                   ? "bg-purple-600 text-white"
//                                   : ""
//                               }
//                             >
//                               {p}
//                             </PaginationLink>
//                           </PaginationItem>
//                         )
//                       )}
//                       <PaginationItem>
//                         <PaginationNext
//                           onClick={() => handlePageChange(currentPage + 1)}
//                           className={
//                             currentPage === totalPages
//                               ? "pointer-events-none opacity-50"
//                               : "cursor-pointer"
//                           }
//                         />
//                       </PaginationItem>
//                     </PaginationContent>
//                   </Pagination>
//                 </motion.div>
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { getAllWorkers } from "@/actions/profiles";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import MapDisplay from "@/components/MapDisplay";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { parseLocationName } from "@/lib/locationUtils";

// interface Worker {
//   id: number;
//   userId: number;
//   name: string;
//   image: string | null;
//   address: string;
//   coordinates: { lat: number; lng: number } | null; // Updated to allow null
//   strengths: string | null;
//   availability: string | null;
//   contactNumber: string | null;
//   email: string | null;
//   experienceLevel: "Beginner" | "Intermediate" | "Expert" | null;
//   preferredWorkTypes: string[] | null;
//   references: { name: string; contact: string; testimonial: string }[] | null;
//   createdAt: Date | null;
//   clerkUserId: string;
// }

// export default function WorkersPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [workers, setWorkers] = useState<Worker[]>([]);
//   const [searchQuery, setSearchQuery] = useState(
//     searchParams.get("query") || ""
//   );
//   const [currentPage, setCurrentPage] = useState(
//     parseInt(searchParams.get("page") || "1", 10)
//   );
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchWorkers = async () => {
//       try {
//         setLoading(true);
//         const { profiles, totalPages } = await getAllWorkers(
//           searchQuery,
//           currentPage
//         );
//         setWorkers(profiles);
//         setTotalPages(totalPages);
//       } catch (error) {
//         console.error("Error fetching workers:", error);
//         toast.error("Failed to load workers.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchWorkers();
//   }, [searchQuery, currentPage]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     setCurrentPage(1);
//     router.push(`/workers?query=${encodeURIComponent(searchQuery)}&page=1`);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     router.push(
//       `/workers?query=${encodeURIComponent(searchQuery)}&page=${page}`
//     );
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto py-8 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen flex justify-center items-center">
//         <p className="text-white">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-8 bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         <Card className="mb-6 bg-gradient-to-br from-purple-800 to-indigo-800 text-white shadow-xl border-0">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-purple-100">
//               Find Workers
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSearch} className="flex gap-2">
//               <Input
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search by name, address, or skills..."
//                 className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
//               />
//               <Button
//                 type="submit"
//                 className="bg-purple-600 hover:bg-purple-700"
//               >
//                 Search
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         {workers.length === 0 ? (
//           <p className="text-center text-white">No workers found.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {workers.map((worker, index) => (
//               <motion.div
//                 key={worker.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: index * 0.1 }}
//               >
//                 <Card className="bg-gradient-to-br from-purple-800 to-indigo-800 text-white shadow-xl border-0">
//                   <CardHeader>
//                     <CardTitle className="text-lg font-bold text-purple-100">
//                       {worker.name}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {worker.image && (
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="flex justify-center"
//                       >
//                         <img
//                           src={worker.image}
//                           alt={worker.name}
//                           className="w-24 h-24 rounded-full object-cover"
//                           onError={(e) =>
//                             (e.currentTarget.src = "/placeholder.png")
//                           }
//                         />
//                       </motion.div>
//                     )}
//                     <div>
//                       <p className="text-sm text-purple-200">
//                         <strong>Location:</strong>{" "}
//                         {parseLocationName(worker.address)}
//                       </p>
//                       {worker.contactNumber && (
//                         <p className="text-sm text-purple-200">
//                           <strong>Contact:</strong> {worker.contactNumber}
//                         </p>
//                       )}
//                       {worker.email && (
//                         <p className="text-sm text-purple-200">
//                           <strong>Email:</strong> {worker.email}
//                         </p>
//                       )}
//                       {worker.strengths && (
//                         <p className="text-sm text-purple-200">
//                           <strong>Strengths:</strong> {worker.strengths}
//                         </p>
//                       )}
//                       {worker.availability && (
//                         <p className="text-sm text-purple-200">
//                           <strong>Availability:</strong> {worker.availability}
//                         </p>
//                       )}
//                       {worker.experienceLevel && (
//                         <p className="text-sm text-purple-200">
//                           <strong>Experience:</strong> {worker.experienceLevel}
//                         </p>
//                       )}
//                       {worker.preferredWorkTypes &&
//                         worker.preferredWorkTypes.length > 0 && (
//                           <p className="text-sm text-purple-200">
//                             <strong>Work Types:</strong>{" "}
//                             {worker.preferredWorkTypes.join(", ")}
//                           </p>
//                         )}
//                       {worker.references && worker.references.length > 0 && (
//                         <div className="text-sm text-purple-200">
//                           <strong>References:</strong>
//                           <ul className="list-disc pl-5">
//                             {worker.references.map((ref, idx) => (
//                               <li key={idx}>
//                                 {ref.name} ({ref.contact}): {ref.testimonial}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}
//                     </div>
//                     {worker.coordinates ? (
//                       <MapDisplay
//                         location={worker.address}
//                         name={worker.name}
//                       />
//                     ) : (
//                       <p className="text-sm text-purple-200">
//                         Location coordinates not available
//                       </p>
//                     )}
//                     <Button
//                       onClick={() =>
//                         router.push(`/view-profile/${worker.clerkUserId}`)
//                       }
//                       className="w-full bg-purple-600 hover:bg-purple-700"
//                     >
//                       View Profile
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         )}

//         {totalPages > 1 && (
//           <div className="flex justify-center gap-2 mt-6">
//             <Button
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//               className="bg-purple-600 hover:bg-purple-700"
//             >
//               Previous
//             </Button>
//             <span className="text-white self-center">
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//               className="bg-purple-600 hover:bg-purple-700"
//             >
//               Next
//             </Button>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { SignedOut } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllWorkers } from "@/actions/profiles";
import SearchBar from "@/components/SearchBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { parseLocationName } from "@/lib/locationUtils";
import Link from "next/link";

interface Worker {
  id: number;
  userId: number;
  name: string;
  image: string | null;
  address: string;
  coordinates: { lat: number; lng: number } | null;
  strengths: string | null;
  availability: string | null;
  contactNumber: string | null;
  email: string | null;
  experienceLevel: "Beginner" | "Intermediate" | "Expert" | null;
  preferredWorkTypes: string[] | null;
  references: { name: string; contact: string; testimonial: string }[] | null;
  createdAt: Date | null;
  clerkUserId: string;
}

export default function WorkersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchWorkers = async () => {
        try {
          setLoading(true);
          const { profiles, totalPages } = await getAllWorkers(
            searchQuery,
            currentPage
          );
          setWorkers(profiles);
          setTotalPages(totalPages);
        } catch (error) {
          console.error("Error fetching workers:", error);
          toast.error("Failed to load workers.");
        } finally {
          setLoading(false);
        }
      };
      fetchWorkers();
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(
      `/workers?query=${encodeURIComponent(searchQuery)}&page=${page}`
    );
  };

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-6">Workers</h1>
        <SearchBar
          placeholder="Search workers by name or address..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <SignedOut>
          <Link href="/sign-in">
            <Button variant="outline" className="mb-4">
              Sign In
            </Button>
          </Link>
        </SignedOut>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <PulseLoader color="#36d7b7" />
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
              }}
            >
              {workers.length === 0 ? (
                <p className="text-center text-muted-foreground col-span-full">
                  No workers found.
                </p>
              ) : (
                workers.map((worker) => (
                  <motion.div
                    key={worker.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link href={`/view-profile/${worker.clerkUserId}`}>
                      <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-t from-purple-900 via-indigo-500 to-black">
                        <CardHeader>
                          <CardTitle className="text-center text-2xl">
                            {worker.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {worker.image && (
                            <div className="flex items-center justify-center">
                              <img
                                src={worker.image}
                                alt={worker.name}
                                className="w-28 h-28 rounded-full object-cover mb-2"
                                onError={(e) =>
                                  (e.currentTarget.src = "/placeholder.png")
                                }
                              />
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground">
                            <strong>Address:</strong>{" "}
                            {parseLocationName(worker.address)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))
              )}
            </motion.div>
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-12 flex justify-center"
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            onClick={() => handlePageChange(p)}
                            className={
                              currentPage === p
                                ? "bg-purple-600 text-white"
                                : ""
                            }
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
