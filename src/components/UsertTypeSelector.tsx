import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
  

export default function UserTypeSelector({userType, setUserType, onClickHandler} : UserTypeSelectorParams): React.JSX.Element {

    const accessChangeHandler = (type: UserType) => {
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
            <SelectContent className="border-none bg-dark-200">
                <SelectItem value="viewer" className="shad-select-item">Viewer</SelectItem>
                <SelectItem value="editor" className="shad-select-item">Editor</SelectItem>
            </SelectContent>
        </Select>

    )
}