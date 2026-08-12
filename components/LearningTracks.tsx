import { tracks } from "@/data/tracks";

export default function LearningTracks() {
  return (
    <section id="tracks" className="dot-bg py-14 sm:py-16">
      <div className="mx-auto max-w-[980px] px-5 text-center sm:px-8 md:px-6">
        <h2 className="font-bold">Our Learning Tracks</h2>
        <p className="mx-auto mt-4 max-w-[510px] text-[#5f5b65]">We aim to build an ecosystem for young techies and startup companies that create value and make a difference while being up to date with the new technologies.</p>
        <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-2">
          {tracks.map(({ title, description, image }) => (
            <article key={title} className="overflow-hidden rounded-xl border-[6px] border-[#eee9f5] bg-white p-3 text-left shadow-soft">
              <img src={image} alt={title} className="h-48 w-full rounded-lg object-cover sm:h-56" />
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 min-h-12 text-[#59535f]">{description}</p>
              <a href="#cohort" className="mt-5 block rounded bg-brand px-4 py-3 font-semibold text-white">View curriculum →</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
