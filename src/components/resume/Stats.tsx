interface StatsProps {
  id: string | number;
  stats?: string[];
  focusText?: string | null;
}

const Stats = ({ id, stats = [], focusText = null }: StatsProps) => (
  <div className="stats">
    {focusText && (
      <p className="mb-0">
        <small className="text-focus">{focusText}</small>
      </p>
    )}
    <div className="stat-pills-container">
      {stats.map((tech, index) => (
        <span key={`${id}-technology-${index}-${tech}`} className="stat-pill">
          {tech}
        </span>
      ))}
    </div>
  </div>
);

export default Stats;
