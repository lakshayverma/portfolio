interface FocusItemsProps {
  items?: string[] | string;
  focusText?: string;
}

const FocusItems = ({ items, focusText = 'Area of Focus:' }: FocusItemsProps) => (
  <div className="achievements">
    {Array.isArray(items) ? (
      <>
        <p className="mb-0">
          <small className="text-focus">{focusText}</small>
        </p>
        {items.map((achievement, index) => (
          <p className="mb-0" key={`${achievement}-${index}`}>
            {achievement}
          </p>
        ))}
      </>
    ) : (
      <p>
        <small className="text-focus">{focusText}</small>
        {items}
      </p>
    )}
  </div>
);

export default FocusItems;
