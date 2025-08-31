

export const Accordion = ({ children }) => {
  return <div className="w-full">{children}</div>;
};

export const AccordionItem = ({ children }) => {
  return <div className="border rounded-lg mb-2">{children}</div>;
};

export const AccordionTrigger = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center p-3 font-semibold bg-gray-100 rounded-lg"
    >
      {children}
    </button>
  );
};

export const AccordionContent = ({ isOpen, children }) => {
  return isOpen ? <div className="p-3">{children}</div> : null;
};
