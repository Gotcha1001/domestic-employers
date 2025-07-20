// "use client";

// import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { Users, Home, Languages, Star, Shield, Clock } from "lucide-react";

// export default function HomePage() {
//   const { user } = useUser();

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//         delayChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.8,
//         ease: "easeOut" as const,
//       },
//     },
//   };

//   const floatingAnimation = {
//     y: [-10, 10, -10],
//     transition: {
//       duration: 3,
//       repeat: Infinity,
//       ease: "easeInOut" as const,
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white overflow-hidden">
//       <div className="absolute inset-0 overflow-hidden">
//         <motion.div
//           className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full opacity-20 blur-3xl"
//           animate={floatingAnimation}
//         />
//         <motion.div
//           className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-15 blur-3xl"
//           animate={{
//             ...floatingAnimation,
//             transition: { ...floatingAnimation.transition, delay: 1.5 },
//           }}
//         />
//       </div>

//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="relative z-10"
//       >
//         <motion.section
//           variants={itemVariants}
//           className="container mx-auto px-6 py-20 text-center"
//         >
//           <motion.h1
//             className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-400 to-pink-300"
//             whileHover={{ scale: 1.05 }}
//             transition={{ type: "spring", stiffness: 300 }}
//           >
//             WorkConnect
//           </motion.h1>
//           <motion.p
//             className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed"
//             variants={itemVariants}
//           >
//             The ultimate platform connecting{" "}
//             <span className="font-bold text-purple-300">domestic workers</span>{" "}
//             and <span className="font-bold text-purple-300">employers</span>{" "}
//             with trust, transparency, and ease
//           </motion.p>

//           <motion.div
//             variants={itemVariants}
//             className="flex justify-center gap-6 mb-16"
//           >
//             <SignedIn>
//               <Link href={`/view-profile/${user?.id}`}>
//                 <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
//                   View Profile
//                 </Button>
//               </Link>
//               <Link href="/profile">
//                 <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
//                   Edit Profile
//                 </Button>
//               </Link>
//               <Link href="/employers">
//                 <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
//                   Browse Employers
//                 </Button>
//               </Link>
//               <Link href="/workers">
//                 <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
//                   Browse Workers
//                 </Button>
//               </Link>
//             </SignedIn>
//             <SignedOut>
//               <Link href="/sign-up">
//                 <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
//                   Get Started Free
//                 </Button>
//               </Link>
//             </SignedOut>
//           </motion.div>
//         </motion.section>

//         {/* Features Section */}
//         <motion.section
//           variants={itemVariants}
//           className="container mx-auto px-6 py-16"
//         >
//           <motion.h2
//             className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300"
//             variants={itemVariants}
//           >
//             How It Works
//           </motion.h2>

//           <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
//             <motion.div
//               variants={itemVariants}
//               whileHover={{ y: -10 }}
//               className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-700/30"
//             >
//               <motion.div
//                 className="flex items-center mb-6"
//                 whileHover={{ scale: 1.1 }}
//               >
//                 <Users className="w-12 h-12 text-purple-300 mr-4" />
//                 <h3 className="text-3xl font-bold text-purple-200">
//                   For Workers
//                 </h3>
//               </motion.div>
//               <div className="space-y-4 text-lg">
//                 <motion.p whileHover={{ x: 10 }} className="flex items-start">
//                   <Star className="w-6 h-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
//                   <span>
//                     Create a stunning profile showcasing your skills,
//                     experience, and availability
//                   </span>
//                 </motion.p>
//                 <motion.p whileHover={{ x: 10 }} className="flex items-start">
//                   <Shield className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
//                   <span>
//                     Get verified and build trust with potential employers
//                     through our secure platform
//                   </span>
//                 </motion.p>
//                 <motion.p whileHover={{ x: 10 }} className="flex items-start">
//                   <Clock className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
//                   <span>
//                     Set your rates, schedule, and preferred work arrangements
//                   </span>
//                 </motion.p>
//                 <motion.p whileHover={{ x: 10 }} className="flex items-start">
//                   <Languages className="w-6 h-6 text-purple-400 mr-3 mt-1 flex-shrink-0" />
//                   <span>
//                     Receive job instructions in your preferred language with
//                     auto-translation
//                   </span>
//                 </motion.p>
//               </div>
//             </motion.div>

//             <motion.div
//               variants={itemVariants}
//               whileHover={{ y: -10 }}
//               className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-700/30"
//             >
//               <motion.div
//                 className="flex items-center mb-6"
//                 whileHover={{ scale: 1.1 }}
//               >
//                 <Home className="w-12 h-12 text-purple-300 mr-4" />
//                 <h3 className="text-3xl font-bold text-purple-200">
//                   For Employers
//                 </h3>
//               </motion.div>
//               <div className="space-y-4 text-lg">
//                 <motion.p whileHover={{ x: 10 }} className="flex items-start">
//                   <Home className="w-6 h-6 text-purple-400 mr-3 mt-1 flex-shrink-0" />
//                   <span>
//                     Design your house profile with detailed layouts, rooms, and
//                     specific requirements
//                   </span>
//                 </motion.p>
//                 <motion.p whileHover={{ x: 10 }} className="flex items-start">
//                   <Star className="w-6 h-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
//                   <span>
//                     Create comprehensive cleaning instructions and task lists
//                   </span>
//                 </motion.p>
//                 <motion.p whileHover={{ x: 10 }} className="flex items-start">
//                   <Languages className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
//                   <span>
//                     Instructions automatically translated to your worker&#39;s
//                     preferred language
//                   </span>
//                 </motion.p>
//                 <motion.p whileHover={{ x: 10 }} className="flex items-start">
//                   <Shield className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
//                   <span>
//                     Browse verified workers with ratings, reviews, and
//                     background checks
//                   </span>
//                 </motion.p>
//               </div>
//             </motion.div>
//           </div>
//         </motion.section>

//         <motion.section
//           variants={itemVariants}
//           className="container mx-auto px-6 py-16"
//         >
//           <motion.h2
//             className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300"
//             variants={itemVariants}
//           >
//             Why Choose WorkConnect?
//           </motion.h2>

//           <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//             {[
//               {
//                 icon: Shield,
//                 title: "Trust & Safety",
//                 description:
//                   "Verified profiles, secure payments, and comprehensive background checks ensure peace of mind for everyone.",
//               },
//               {
//                 icon: Languages,
//                 title: "Multi-Language Support",
//                 description:
//                   "Break language barriers with automatic translation of job instructions and communication.",
//               },
//               {
//                 icon: Star,
//                 title: "Quality Matching",
//                 description:
//                   "Smart matching algorithm connects the right workers with the right employers based on skills and preferences.",
//               },
//             ].map((benefit, index) => (
//               <motion.div
//                 key={index}
//                 variants={itemVariants}
//                 whileHover={{ y: -15, scale: 1.05 }}
//                 className="bg-gradient-to-br from-purple-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-purple-700/20"
//               >
//                 <motion.div
//                   whileHover={{ rotate: 360 }}
//                   transition={{ duration: 0.6 }}
//                   className="inline-block mb-4"
//                 >
//                   <benefit.icon className="w-16 h-16 text-purple-300 mx-auto" />
//                 </motion.div>
//                 <h3 className="text-2xl font-bold mb-4 text-purple-200">
//                   {benefit.title}
//                 </h3>
//                 <p className="text-gray-300 leading-relaxed">
//                   {benefit.description}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </motion.section>

//         <motion.section
//           variants={itemVariants}
//           className="container mx-auto px-6 py-20 text-center"
//         >
//           <motion.h2
//             className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300"
//             variants={itemVariants}
//           >
//             Ready to Get Started?
//           </motion.h2>
//           <motion.p
//             className="text-xl mb-12 max-w-2xl mx-auto text-gray-300"
//             variants={itemVariants}
//           >
//             Join thousands of satisfied workers and employers who trust
//             WorkConnect for their domestic service needs.
//           </motion.p>

//           <SignedOut>
//             <motion.div
//               variants={itemVariants}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Link href="/sign-up">
//                 <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl py-6 px-12 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform">
//                   Create Your Profile Today
//                 </Button>
//               </Link>
//             </motion.div>
//           </SignedOut>
//         </motion.section>
//       </motion.div>
//     </div>
//   );
// }

"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Home, Languages, Star, Shield, Clock } from "lucide-react";

export default function HomePage() {
  const { user } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-purple-600 rounded-full opacity-20 blur-3xl"
          animate={floatingAnimation}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-purple-500 rounded-full opacity-15 blur-3xl"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 1.5 },
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <motion.section
          variants={itemVariants}
          className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 text-center"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-400 to-pink-300"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            WorkConnect
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            The ultimate platform connecting{" "}
            <span className="font-bold text-purple-300">domestic workers</span>{" "}
            and <span className="font-bold text-purple-300">employers</span>{" "}
            with trust, transparency, and ease
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 sm:mb-16"
          >
            <SignedIn>
              <Link href={`/view-profile/${user?.id}`}>
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm sm:text-base md:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  View Profile
                </Button>
              </Link>
              <Link href="/profile">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm sm:text-base md:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Edit Profile
                </Button>
              </Link>
              <Link href="/employers">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm sm:text-base md:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Browse Employers
                </Button>
              </Link>
              <Link href="/workers">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm sm:text-base md:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Browse Workers
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm sm:text-base md:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Get Started Free
                </Button>
              </Link>
            </SignedOut>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          variants={itemVariants}
          className="container mx-auto px-4 sm:px-6 py-12 sm:py-16"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300"
            variants={itemVariants}
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-700/30"
            >
              <motion.div
                className="flex items-center mb-4 sm:mb-6"
                whileHover={{ scale: 1.1 }}
              >
                <Users className="w-8 h-8 sm:w-12 sm:h-12 text-purple-300 mr-3 sm:mr-4" />
                <h3 className="text-2xl sm:text-3xl font-bold text-purple-200">
                  For Workers
                </h3>
              </motion.div>
              <div className="space-y-4 text-base sm:text-lg">
                <motion.p whileHover={{ x: 10 }} className="flex items-start">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                  <span>
                    Create a stunning profile showcasing your skills,
                    experience, and availability
                  </span>
                </motion.p>
                <motion.p whileHover={{ x: 10 }} className="flex items-start">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                  <span>
                    Get verified and build trust with potential employers
                    through our secure platform
                  </span>
                </motion.p>
                <motion.p whileHover={{ x: 10 }} className="flex items-start">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                  <span>
                    Set your rates, schedule, and preferred work arrangements
                  </span>
                </motion.p>
                <motion.p whileHover={{ x: 10 }} className="flex items-start">
                  <Languages className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                  <span>
                    Receive job instructions in your preferred language with
                    auto-translation
                  </span>
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-700/30"
            >
              <motion.div
                className="flex items-center mb-4 sm:mb-6"
                whileHover={{ scale: 1.1 }}
              >
                <Home className="w-8 h-8 sm:w-12 sm:h-12 text-purple-300 mr-3 sm:mr-4" />
                <h3 className="text-2xl sm:text-3xl font-bold text-purple-200">
                  For Employers
                </h3>
              </motion.div>
              <div className="space-y-4 text-base sm:text-lg">
                <motion.p whileHover={{ x: 10 }} className="flex items-start">
                  <Home className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                  <span>
                    Design your house profile with detailed layouts, rooms, and
                    specific requirements
                  </span>
                </motion.p>
                <motion.p whileHover={{ x: 10 }} className="flex items-start">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                  <span>
                    Create comprehensive cleaning instructions and task lists
                  </span>
                </motion.p>
                <motion.p whileHover={{ x: 10 }} className="flex items-start">
                  <Languages className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                  <span>
                    Instructions automatically translated to your worker&#39;s
                    preferred language
                  </span>
                </motion.p>
                <motion.p whileHover={{ x: 10 }} className="flex items-start">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                  <span>
                    Browse verified workers with ratings, reviews, and
                    background checks
                  </span>
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="container mx-auto px-4 sm:px-6 py-12 sm:py-16"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300"
            variants={itemVariants}
          >
            Why Choose WorkConnect?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Trust & Safety",
                description:
                  "Verified profiles, secure payments, and comprehensive background checks ensure peace of mind for everyone.",
              },
              {
                icon: Languages,
                title: "Multi-Language Support",
                description:
                  "Break language barriers with automatic translation of job instructions and communication.",
              },
              {
                icon: Star,
                title: "Quality Matching",
                description:
                  "Smart matching algorithm connects the right workers with the right employers based on skills and preferences.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -15, scale: 1.05 }}
                className="bg-gradient-to-br from-purple-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center shadow-xl border border-purple-700/20"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-block mb-3 sm:mb-4"
                >
                  <benefit.icon className="w-12 h-12 sm:w-16 sm:h-16 text-purple-300 mx-auto" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-purple-200">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300"
            variants={itemVariants}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto text-gray-300"
            variants={itemVariants}
          >
            Join thousands of satisfied workers and employers who trust
            WorkConnect for their domestic service needs.
          </motion.p>

          <SignedOut>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-base sm:text-lg md:text-xl py-4 sm:py-6 px-8 sm:px-12 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform">
                  Create Your Profile Today
                </Button>
              </Link>
            </motion.div>
          </SignedOut>
        </motion.section>
      </motion.div>
    </div>
  );
}
