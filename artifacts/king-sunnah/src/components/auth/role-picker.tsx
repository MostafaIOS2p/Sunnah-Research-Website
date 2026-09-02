import { GraduationCap, PenLine, Microscope, User, type LucideIcon } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ROLE_OPTIONS, type UserRole } from '@/lib/auth';
import { X } from 'lucide-react';

const ROLE_ICONS: Record<UserRole, LucideIcon> = {
  student: GraduationCap,
  teacher: PenLine,
  researcher: Microscope,
  enthusiast: User,
};

type RolePickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: UserRole | null;
  onSelect: (role: UserRole) => void;
};

export function RolePicker({ open, onOpenChange, value, onSelect }: RolePickerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between text-right">
          <DrawerTitle className="font-display text-xl font-medium">اختر صفتك</DrawerTitle>
          <DrawerClose className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground">
            <X className="h-4 w-4" />
          </DrawerClose>
        </DrawerHeader>
        <div className="flex flex-col gap-2 px-4 pb-8">
          {ROLE_OPTIONS.map((option) => {
            const Icon = ROLE_ICONS[option.value];
            const isActive = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSelect(option.value);
                  onOpenChange(false);
                }}
                className={
                  isActive
                    ? 'flex items-center justify-between gap-3 rounded-2xl border border-primary bg-primary/5 px-4 py-3.5 text-base font-medium text-foreground transition-colors'
                    : 'flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-transparent px-4 py-3.5 text-base text-foreground transition-colors hover:bg-foreground/[0.03]'
                }
              >
                <span>{option.label}</span>
                <Icon className={isActive ? 'h-5 w-5 text-primary' : 'h-5 w-5 text-foreground/50'} />
              </button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
