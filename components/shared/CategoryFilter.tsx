import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CategoryFilter = () => {
  return (
    <Select>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        <SelectItem value="music">Music</SelectItem>
        <SelectItem value="sports">Sports</SelectItem>
        <SelectItem value="food">Food & Drink</SelectItem>
        <SelectItem value="art">Art & Culture</SelectItem>
        <SelectItem value="business">Business</SelectItem>
        <SelectItem value="tech">Technology</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default CategoryFilter 