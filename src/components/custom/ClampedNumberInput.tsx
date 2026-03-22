import { Input } from "@/components/ui/input";
import { ChangeEvent, FocusEvent } from "react";

type Props = {
  className?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
};

export function ClampedNumberInput(props: Props) {
  function onChange(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    const value = Number(e.target.value);
    const min = props.min ?? -Infinity;
    const max = props.max ?? Infinity;
    props.onChange(Math.max(min, Math.min(value, max)));
  }

  function onBlur(e: FocusEvent<HTMLInputElement, Element>) {
    if (e.target.value === "") {
      props.onChange(props.min ?? -Infinity);
    }
  }

  return (
    <Input
      type="number"
      className={props.className}
      value={props.value}
      step={props.step}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}
