import * as React from "react"
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-600",
        warning:
          "border-yellow-200 bg-yellow-50 text-yellow-800 [&>svg]:text-yellow-600",
        info:
          "border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

// Pre-configured alert components for common use cases
const ErrorAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { title?: string; description?: string }
>(({ className, title = "Error", description, children, ...props }, ref) => (
  <Alert ref={ref} variant="destructive" className={className} {...props}>
    <XCircle className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    {description && <AlertDescription>{description}</AlertDescription>}
    {children}
  </Alert>
))
ErrorAlert.displayName = "ErrorAlert"

const SuccessAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { title?: string; description?: string }
>(({ className, title = "Success", description, children, ...props }, ref) => (
  <Alert ref={ref} variant="success" className={className} {...props}>
    <CheckCircle className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    {description && <AlertDescription>{description}</AlertDescription>}
    {children}
  </Alert>
))
SuccessAlert.displayName = "SuccessAlert"

const WarningAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { title?: string; description?: string }
>(({ className, title = "Warning", description, children, ...props }, ref) => (
  <Alert ref={ref} variant="warning" className={className} {...props}>
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    {description && <AlertDescription>{description}</AlertDescription>}
    {children}
  </Alert>
))
WarningAlert.displayName = "WarningAlert"

const InfoAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { title?: string; description?: string }
>(({ className, title = "Info", description, children, ...props }, ref) => (
  <Alert ref={ref} variant="info" className={className} {...props}>
    <Info className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    {description && <AlertDescription>{description}</AlertDescription>}
    {children}
  </Alert>
))
InfoAlert.displayName = "InfoAlert"

export { 
  Alert, 
  AlertTitle, 
  AlertDescription, 
  ErrorAlert, 
  SuccessAlert, 
  WarningAlert, 
  InfoAlert 
}
