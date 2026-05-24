import type { DateEntry } from '@/app/types';

interface DatesProps {
  dates: DateEntry[];
}

const Dates = ({ dates }: DatesProps) => (
  <>
    {dates.map((date, index) => (
      <em className="date" key={`${date.title}-${index}`}>
        <small>{date.title}</small> <span>{date.month} {date.year}</span>
      </em>
    ))}
  </>
);

export default Dates;
