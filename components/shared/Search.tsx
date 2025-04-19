import { SearchParamProps } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

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
      <Button className="w-full md:w-fit">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  )
}

export default Search 