import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid2X2, ListIcon } from "lucide-react";

interface ViewOptions {
    view: "grid" | "list";
    setView: React.Dispatch<React.SetStateAction<"grid" | "list">>;
    numberRooms?: number;
    searchTerm?: string;
    setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
}

export default function ToolbarSearch({view ,setView, numberRooms, searchTerm, setSearchTerm}: ViewOptions): React.JSX.Element {
    return(
        <Card className="mb-6 border-custom-cards">   
            <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 w-[400px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"/>
                            <Input 
                                type="text" 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                                className="border-4 border-black pl-8 bg-white" 
                                placeholder="Search document..."
                            />
                        </div>
                        <Button variant="outline" className="border-custom-btn">
                            Search
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg border-4 border-black bg-toxic-500 text-black h-9 w-9 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xl font-bold">{numberRooms}</h3>
                        </div>
                        <Button 
                            variant="outline" 
                            className={`border-4 border-black ${view === "grid" ? "bg-yellow-500" : "bg-white"} hover:bg-yellow-100 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                            onClick={() => setView("grid")}
                            >
                            <Grid2X2 className="h-4 w-4"/>
                        </Button>
                        <Button 
                            variant="outline" 
                            className={`border-4 border-black ${view === "list" ? "bg-yellow-500" : "bg-white"} hover:bg-yellow-100 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                            onClick={() => setView("list")}
                            >
                            <ListIcon className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}