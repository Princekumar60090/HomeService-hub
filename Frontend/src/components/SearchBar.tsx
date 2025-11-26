import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffCategory } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (city && category) {
      navigate(`/search?city=${city}&category=${category}`);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Select City
          </label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose your city" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="Lucknow">Lucknow</SelectItem>
              <SelectItem value="Patna">Patna</SelectItem>
              <SelectItem value="Kanpur">Kanpur</SelectItem>
              <SelectItem value="Varanasi">Varanasi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Service Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="What do you need?" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value={StaffCategory.MAID}>Maid Service</SelectItem>
              <SelectItem value={StaffCategory.MECHANIC}>Mechanic</SelectItem>
              <SelectItem value={StaffCategory.WORKER}>Worker</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button 
            onClick={handleSearch} 
            size="lg"
            className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={!city || !category}
          >
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};
