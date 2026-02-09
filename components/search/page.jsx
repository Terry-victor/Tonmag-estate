// "use client";

// import { } from "next/navigation";
// import { useEffect, useState } from "react";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "@/lib/firebase";

// export default function SearchPage() {
//   const searchParams = useSearchParams();
//   const searchQuery = searchParams.get("query") || "";

//   const [results, setResults] = useState([]);
//   const [beds, setBeds] = useState(0);
//   const [type, setType] = useState("");

//   useEffect(() => {
//     const fetchProperties = async () => {
//       let q = query(collection(db, "properties"));

//       if (type) {
//         q = query(q, where("type", "==", type));
//       }

//       const snapshot = await getDocs(q);
//       let data = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       if (searchQuery) {
//         data = data.filter((p) =>
//           p.location.toLowerCase().includes(searchQuery.toLowerCase()),
//         );
//       }

//       if (beds > 0) {
//         data = data.filter((p) => p.beds >= beds);
//       }

//       setResults(data);
//     };

//     fetchProperties();
//   }, [searchQuery, beds, type]);

//   return (
//     <section className="relative min-h-screen text-white overflow-hidden">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('/luxurious-villa-with-modern-architectural-design.png')",
//         }}
//       >
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />
//       </div>

//       {/* Content */}
//       <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-10">
//         <h1 className="text-3xl font-light">
//           Results for <span className="text-accent">“{searchQuery}”</span>
//         </h1>

//         {/* Filters */}
//         <div className="flex gap-4">
//           <select
//             onChange={(e) => setBeds(Number(e.target.value))}
//             className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-2 rounded-lg"
//           >
//             <option value="0">Any Beds</option>
//             <option value="3">3+</option>
//             <option value="4">4+</option>
//           </select>

//           <select
//             onChange={(e) => setType(e.target.value)}
//             className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-2 rounded-lg"
//           >
//             <option value="">Buy & Rent</option>
//             <option value="buy">Buy</option>
//             <option value="rent">Rent</option>
//             <option value="rent">Lease</option>
//           </select>

//           <select
//             onChange={(e) => setType(e.target.value)}
//             className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-2 rounded-lg"
//           >
//             <option value="">Location </option>
//             <option value="buy">Kurudu</option>
//             <option value="rent">Trademall</option>
//             <option value="rent">Phase 2 </option>
//           </select>
//         </div>

//         {/* Results */}
//         {results.length === 0 && (
//           <p className="text-gray-400">No properties found.</p>
//         )}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {results.map((p) => (
//             <div
//               key={p.id}
//               className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition"
//             >
//               <div
//                 className="h-40 rounded-xl mb-4 bg-cover bg-center"
//                 style={{ backgroundImage: `url(${p.image})` }}
//               />
//               <h3 className="text-lg font-medium">{p.title}</h3>
//               <p className="text-gray-400 text-sm">{p.location}</p>
//               <p className="mt-2 text-sm">
//                 ₦{p.price.toLocaleString()} • {p.beds} Beds • {p.type}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
