import { useState } from "react";

export function useCards() {
  const [cards, setCards] = useState([
    { id: 1, type: "Debit Card", number: "1234567812345678", blocked: false },
    { id: 2, type: "Credit Card", number: "9876543210987654", blocked: true },
  ]);

  const toggleBlock = (id) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, blocked: !c.blocked } : c
      )
    );
  };

  const updateLimit = (id, newLimit) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, limit: newLimit } : c
      )
    );
  };

  return { cards, toggleBlock, updateLimit };
}
