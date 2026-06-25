import { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CouponInputProps {
  id: string;
  label: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

export function CouponInput({ id, label, placeholder, registration, error }: CouponInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        placeholder={placeholder}
        {...registration}
      />
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
