import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearRangePickerProps {
  startYear: number;
  endYear: number;
  onStartYearChange: (year: number) => void;
  onEndYearChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

export function YearRangePicker({
  startYear,
  endYear,
  onStartYearChange,
  onEndYearChange,
  minYear = 2023,
  maxYear = 2050
}: YearRangePickerProps) {
  // Generate array of years from minYear to maxYear
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-gray-700">Year Range:</label>
      
      <div className="flex items-center gap-2">
        <Select 
          value={startYear.toString()} 
          onValueChange={(value) => onStartYearChange(parseInt(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.filter(year => year <= endYear).map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <span className="text-gray-500">to</span>
        
        <Select 
          value={endYear.toString()} 
          onValueChange={(value) => onEndYearChange(parseInt(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.filter(year => year >= startYear).map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
