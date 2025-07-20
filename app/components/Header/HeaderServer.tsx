// import { SignedIn, SignedOut } from "@clerk/nextjs";
// import { checkUser } from "@/lib/checkUser";

// const HeaderServer = async () => {
//   await checkUser();

//   return (
//     <div>
//       <SignedIn></SignedIn>
//       <SignedOut></SignedOut>
//     </div>
//   );
// };

// export default HeaderServer;

// HeaderServer.tsx
import { checkUser } from "@/lib/checkUser";
import HeaderClient from "./HeaderClient";

export default async function HeaderServer() {
  const userData = await checkUser();
  return <HeaderClient userData={userData} />;
}
