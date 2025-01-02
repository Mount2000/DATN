import { Input, Flex, FormLabel } from "@chakra-ui/react";
import { memo } from "react";

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields, style, placeholder, isHideLabel }) => {
    return (
        <Flex mb="4px">
            {!isHideLabel && <FormLabel
                htmlFor={nameKey}>{nameKey.slice(0, 1).toUpperCase() + nameKey.slice(1)}</FormLabel>}
            <Input
                type={type || 'text'}
                textStyle={style}
                placeholder={placeholder || nameKey.slice(0, 1).toUpperCase() + nameKey.slice(1)}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => setInvalidFields && setInvalidFields([])}>
            </Input>

            {invalidFields?.some(el => el.name === nameKey) && <small className="text-main italic">{invalidFields.find(el => el.name == nameKey)?.mes}</small>}

        </Flex>
    )
}

export default memo(InputField)