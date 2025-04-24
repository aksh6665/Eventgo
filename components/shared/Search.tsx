import { Search as SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Search = ({ placeholder = 'Search title...' }: { placeholder?: string }) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-5 md:flex-row">
      <div className="flex w-full md:w-3/4">
        <Input 
          type="text"
          placeholder={placeholder}
          className="input-field"
        />
      </div>
      <Button className="w-full md:w-fit flex items-center justify-center gap-2">
        <SearchIcon className="w-4 h-4" />
        <span>Search</span>
      </Button>
    </div>
  )
}

export default Search 