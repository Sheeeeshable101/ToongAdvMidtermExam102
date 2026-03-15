import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CD {
  id: string;
  title: string;
  artist: string;
  availableCopies: number;
}

export interface Borrowed {
  id: string;
  cdId: string;
  borrowerName: string;
  borrowDate: Date;
  dueDate: Date;
}

interface CDContextType {
  cds: CD[];
  borrowed: Borrowed[];
  totalIncome: number;
  totalBorrowed: number;
  borrowCD: (cdId: string, borrowerName: string) => Promise<void>;
  returnCD: (borrowedId: string) => Promise<void>;
  isLoading: boolean;
}

const CDContext = createContext<CDContextType | undefined>(undefined);

const STORAGE_KEYS = {
  cds: "cd_library_cds",
  borrowed: "cd_library_borrowed",
  totalIncome: "cd_library_totalIncome",
  totalBorrowed: "cd_library_totalBorrowed",
};

export const CDProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cds, setCds] = useState<CD[]>([]);
  const [borrowed, setBorrowed] = useState<Borrowed[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const initialCDs: CD[] = [
    {
      id: "1",
      title: "Thriller",
      artist: "Michael Jackson",
      availableCopies: 5,
    },
    { id: "2", title: "Abbey Road", artist: "The Beatles", availableCopies: 3 },
    { id: "3", title: "Back in Black", artist: "AC/DC", availableCopies: 4 },
    {
      id: "4",
      title: "The Bodyguard",
      artist: "Whitney Houston",
      availableCopies: 2,
    },
    { id: "5", title: "Rumours", artist: "Fleetwood Mac", availableCopies: 6 },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const cdsData = await AsyncStorage.getItem(STORAGE_KEYS.cds);
      const borrowedData = await AsyncStorage.getItem(STORAGE_KEYS.borrowed);
      const incomeData = await AsyncStorage.getItem(STORAGE_KEYS.totalIncome);
      const borrowedCountData = await AsyncStorage.getItem(
        STORAGE_KEYS.totalBorrowed,
      );

      const loadedCds: CD[] = cdsData ? JSON.parse(cdsData) : initialCDs;
      setCds(loadedCds);

      const loadedBorrowed: Borrowed[] = borrowedData
        ? JSON.parse(borrowedData).map((b: any) => ({
            ...b,
            borrowDate: new Date(b.borrowDate),
            dueDate: new Date(b.dueDate),
          }))
        : [];
      setBorrowed(loadedBorrowed);

      setTotalIncome(incomeData ? parseFloat(incomeData) : 0);
      setTotalBorrowed(borrowedCountData ? parseInt(borrowedCountData) : 0);
    } catch (error) {
      console.error("Load error:", error);
      setCds(initialCDs);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.cds, JSON.stringify(cds));
      await AsyncStorage.setItem(
        STORAGE_KEYS.borrowed,
        JSON.stringify(borrowed),
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.totalIncome,
        totalIncome.toString(),
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.totalBorrowed,
        totalBorrowed.toString(),
      );
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const borrowCD = async (cdId: string, borrowerName: string) => {
    const cdIndex = cds.findIndex((c) => c.id === cdId);
    if (cdIndex === -1 || cds[cdIndex].availableCopies <= 0) {
      throw new Error("CD not available");
    }

    const newCds = [...cds];
    newCds[cdIndex].availableCopies -= 1;
    setCds(newCds);

    const newBorrowed: Borrowed = {
      id: Date.now().toString(),
      cdId,
      borrowerName,
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
    setBorrowed([...borrowed, newBorrowed]);
    setTotalBorrowed((prev) => prev + 1);

    await saveData();
  };

  const returnCD = async (borrowedId: string) => {
    const borrowedIndex = borrowed.findIndex((b) => b.id === borrowedId);
    if (borrowedIndex === -1) return;

    const borrowedItem = borrowed[borrowedIndex];
    const now = new Date();
    const daysOverdue = Math.ceil(
      (now.getTime() - borrowedItem.dueDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysOverdue > 0) {
      const penalty = daysOverdue * 2;
      setTotalIncome((prev) => prev + penalty);
    }

    const newBorrowed = borrowed.filter((_, i) => i !== borrowedIndex);
    setBorrowed(newBorrowed);

    const cdIndex = cds.findIndex((c) => c.id === borrowedItem.cdId);
    if (cdIndex !== -1) {
      const newCds = [...cds];
      newCds[cdIndex].availableCopies += 1;
      setCds(newCds);
    }

    await saveData();
  };

  return (
    <CDContext.Provider
      value={{
        cds,
        borrowed,
        totalIncome,
        totalBorrowed,
        borrowCD,
        returnCD,
        isLoading,
      }}
    >
      {children}
    </CDContext.Provider>
  );
};

export const useCDContext = () => {
  const context = useContext(CDContext);
  if (context === undefined) {
    throw new Error("useCDContext must be used within CDProvider");
  }
  return context;
};
