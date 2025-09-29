import React from 'react';
import { CheckCircle, Clock, Truck, Package, XCircle } from 'lucide-react';
import { Order } from '@/lib/api';

interface OrderStatusTimelineProps {
  order: Order;
}

const statusConfig = {
  PENDING: {
    icon: Clock,
    label: 'Order Placed',
    description: 'Your order has been placed and is being reviewed',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  CONFIRMED: {
    icon: CheckCircle,
    label: 'Order Confirmed',
    description: 'Your order has been confirmed and payment processed',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  PROCESSING: {
    icon: Package,
    label: 'Processing',
    description: 'Your order is being prepared for shipment',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  SHIPPED: {
    icon: Truck,
    label: 'Shipped',
    description: 'Your order has been shipped and is on its way',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  DELIVERED: {
    icon: CheckCircle,
    label: 'Delivered',
    description: 'Your order has been delivered successfully',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  CANCELLED: {
    icon: XCircle,
    label: 'Cancelled',
    description: 'Your order has been cancelled',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  REFUNDED: {
    icon: XCircle,
    label: 'Refunded',
    description: 'Your order has been refunded',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderStatusTimeline({ order }: OrderStatusTimelineProps) {
  const currentStatusIndex = statusOrder.indexOf(order.status);
  const progressPercentage = ((currentStatusIndex + 1) / statusOrder.length) * 100;
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 text-center">
          {Math.round(progressPercentage)}% Complete
        </div>
      </div>
      
      <div className="space-y-4">
        {statusOrder.map((status, index) => {
          const config = statusConfig[status as keyof typeof statusConfig];
          const Icon = config.icon;
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const isLast = index === statusOrder.length - 1;
          
          return (
            <div key={status} className="relative">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? config.bgColor : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      isCompleted ? config.color : 'text-gray-400'
                    }`} />
                  </div>
                  
                  {/* Connecting line to next step */}
                  {!isLast && (
                    <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                      isCompleted ? 'bg-gray-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 pb-8">
                  <div className={`text-sm font-medium ${
                    isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                    {config.label}
                  </div>
                  <div className={`text-xs ${
                    isCurrent ? 'text-gray-600' : isCompleted ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {config.description}
                  </div>
                  
                  {/* Show specific dates if available */}
                  {isCurrent && (
                    <div className="text-xs text-gray-500 mt-1">
                      {status === 'PENDING' && `Order placed on ${new Date(order.createdAt).toLocaleDateString()}`}
                      {status === 'CONFIRMED' && order.payments.length > 0 && 
                        `Confirmed on ${new Date(order.payments[0].initiatedAt).toLocaleDateString()}`}
                      {status === 'SHIPPED' && order.shipments.length > 0 && 
                        `Shipped on ${new Date(order.shipments[0].createdAt).toLocaleDateString()}`}
                      {status === 'DELIVERED' && order.shipments.length > 0 && 
                        `Delivered on ${new Date(order.shipments[0].deliveredAt || order.shipments[0].updatedAt).toLocaleDateString()}`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Show cancelled/refunded status if applicable */}
      {(order.status === 'CANCELLED' || order.status === 'REFUNDED') && (
        <div className="flex items-start space-x-3 pt-4 border-t">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            statusConfig[order.status].bgColor
          }`}>
            {React.createElement(statusConfig[order.status].icon, {
              className: `h-4 w-4 ${statusConfig[order.status].color}`
            })}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {statusConfig[order.status].label}
            </div>
            <div className="text-xs text-gray-600">
              {statusConfig[order.status].description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
