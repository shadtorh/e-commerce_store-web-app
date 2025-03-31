import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = () => {
	const {
		cart,
		clearCart,
		decreaseQuantity,
		increaseQuantity,
		removeFromCart,
	} = useCartStore();

	return (
		<div className="bg-white rounded-lg shadow-sm p-6 mb-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-xl font-semibold text-gray-900">
					Shopping Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)}{" "}
					items)
				</h1>
				<button
					onClick={() => clearCart()}
					className="text-sm text-red-600 hover:text-red-700 flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
				>
					<Trash2 size={16} />
					Clear Cart
				</button>
			</div>

			<div className="divide-y divide-gray-200">
				{cart.map((item) => (
					<motion.div
						key={item._id}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="py-6 first:pt-0 last:pb-0"
					>
						<div className="flex gap-6">
							<div className="w-24 h-24 flex-shrink-0">
								<img
									src={item.image}
									alt={item.name}
									className="w-full h-full object-cover rounded-md"
								/>
							</div>

							<div className="flex-grow">
								<div className="flex justify-between">
									<div>
										<h3 className="text-sm font-medium text-gray-900">
											{item.name}
										</h3>
										<p className="mt-1 text-sm text-gray-500">
											Unit Price: ${item.price}
										</p>
									</div>
									<p className="text-base font-medium text-gray-900">
										${(item.price * item.quantity).toFixed(2)}
									</p>
								</div>

								<div className="mt-4 flex items-center justify-between">
									<div className="flex items-center border rounded-md">
										<button
											onClick={() => decreaseQuantity(item._id)}
											className="p-2 hover:bg-gray-50"
											disabled={item.quantity <= 1}
										>
											<Minus size={16} />
										</button>
										<span className="px-4 py-2 text-sm">{item.quantity}</span>
										<button
											onClick={() => increaseQuantity(item._id)}
											className="p-2 hover:bg-gray-50"
										>
											<Plus size={16} />
										</button>
									</div>

									<button
										onClick={() => removeFromCart(item._id)}
										className="text-sm text-red-600 hover:text-red-500 flex items-center"
									>
										<Trash2 size={16} className="mr-1" />
										Remove
									</button>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default CartItem;
