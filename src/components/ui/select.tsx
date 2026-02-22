import * as React from "react"
import { Select as SelectRoot } from "radix-ui"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectRoot.Root
const SelectGroup = SelectRoot.Group
const SelectValue = SelectRoot.Value
const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectRoot.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectRoot.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectRoot.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectRoot.Icon asChild>
      <ChevronDownIcon className="size-4 opacity-50" />
    </SelectRoot.Icon>
  </SelectRoot.Trigger>
))
SelectTrigger.displayName = SelectRoot.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectRoot.Content>,
  React.ComponentPropsWithoutRef<typeof SelectRoot.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectRoot.Portal>
    <SelectRoot.Content
      ref={ref}
      data-slot="select-content"
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectRoot.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectRoot.Viewport>
      <SelectScrollDownButton />
    </SelectRoot.Content>
  </SelectRoot.Portal>
))
SelectContent.displayName = SelectRoot.Content.displayName

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectRoot.Label>,
  React.ComponentPropsWithoutRef<typeof SelectRoot.Label>
>(({ className, ...props }, ref) => (
  <SelectRoot.Label
    ref={ref}
    data-slot="select-label"
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectRoot.Label.displayName

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectRoot.Item>,
  React.ComponentPropsWithoutRef<typeof SelectRoot.Item>
>(({ className, children, ...props }, ref) => (
  <SelectRoot.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <SelectRoot.ItemIndicator>
        <CheckIcon className="size-4" />
      </SelectRoot.ItemIndicator>
    </span>
    <SelectRoot.ItemText>{children}</SelectRoot.ItemText>
  </SelectRoot.Item>
))
SelectItem.displayName = SelectRoot.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectRoot.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectRoot.Separator>
>(({ className, ...props }, ref) => (
  <SelectRoot.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectRoot.Separator.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ComponentRef<typeof SelectRoot.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectRoot.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectRoot.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUpIcon className="size-4" />
  </SelectRoot.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectRoot.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ComponentRef<typeof SelectRoot.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectRoot.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectRoot.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDownIcon className="size-4" />
  </SelectRoot.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectRoot.ScrollDownButton.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
