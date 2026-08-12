type Props = { small?: boolean };
export default function StudentBlob({ small = false }: Props) {
  const size = small ? "h-40 w-36" : "h-52 w-48";
  return <div className={`relative ${size}`} aria-label="Innovatio Academy student" role="img">
    <div className="blob-top absolute left-0 top-0 h-[62%] w-[77%] overflow-hidden bg-[#d9eadf]"><img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80" alt="Student learning" className="h-full w-full object-cover" /></div>
    <div className="absolute left-[58%] top-[45%] h-16 w-16 rounded-[10px_50px_50px_50px] bg-[#e00019]" />
    <div className="blob-bottom absolute bottom-0 left-0 h-[53%] w-full overflow-hidden bg-[#d9eadf]"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80" alt="Student working on a laptop" className="h-full w-full object-cover" /></div>
  </div>;
}
