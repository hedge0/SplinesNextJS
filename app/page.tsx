import InteractiblePlot from "@/components/InteractiblePlot"

export default function Home() {
  const S = 566.345;
  const T = 0.015708354371353372;
  const q = 0.0035192;
  const r = 0.0486;
  const option_type = 'calls';

  return (
    <div className="flex flex-col items-center justify-start min-h-[95vh] py-4 mt-10">
      <InteractiblePlot S={S} T={T} q={q} r={r} option_type={option_type} />
    </div>
  );
}
