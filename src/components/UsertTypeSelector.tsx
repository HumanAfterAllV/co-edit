import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
  

export default function UserTypeSelector({userType, setUserType, onClickHandler} : UserTypeSelectorParams): React.JSX.Element {

    const accessChangeHandler = (type: UserType) => {
        console.log("User type:", type);
        setUserType(type);

        if(onClickHandler) {
            onClickHandler(type);
        }
    }
    return(
        <Select value={userType} onValueChange={(type: UserType) => accessChangeHandler(type)}>
            <SelectTrigger className="shad-select">
                <SelectValue/>
            </SelectTrigger>
            <SelectContent className="text-black border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <SelectItem value="viewer" className="hover:bg-yellow-500 focus:bg-yellow-500">Viewer</SelectItem>
                <SelectItem value="editor" className="hover:bg-yellow-500 focus:bg-yellow-500">Editor</SelectItem>
            </SelectContent>
        </Select>

    )
}