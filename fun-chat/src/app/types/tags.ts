interface BaseTagsProps {
  className?: string;
  textContent?: string;
  onclick?: (e: Event) => void;
}

interface InputProps extends BaseTagsProps {
  required?: string;
  type?: string;
  value?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
}

export { BaseTagsProps, InputProps };
