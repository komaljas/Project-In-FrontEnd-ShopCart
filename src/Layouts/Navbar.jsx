import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, UserRound, Search } from 'lucide-react'
import { useStore } from '../context/store'

function Navbar({ cartCount = 0 }) {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, wishlist } = useStore();

    const handleSearch = (e) => {
        e.preventDefault();

        if(!searchQuery.trim()) return;
        console.log('Searching for:', searchQuery);
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
            <nav className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:gap-x-4 lg:px-6">

                {/* ShopCart Logo */}
                <Link to="/" className="flex shrink-0 items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-200 sm:h-10 sm:w-10">
                        <ShoppingCart size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-extrabold tracking-tight sm:text-xl">
                        <span className="text-gray-950">Shop</span>
                        <span className="text-blue-600">Cart</span>
                    </span>
                </Link>

                {/* Search Bar - full width on mobile, inline from sm up */}
                <form
                    onSubmit={handleSearch}
                    className="order-last flex w-full min-w-0 items-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 transition focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 sm:order-2 sm:ml-4 sm:w-auto sm:flex-1"
                >
                    <Search size={18} className="ml-4 shrink-0 text-gray-500"/>
                    <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." aria-label="Search products" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"/>

                    <button type="submit" aria-label="Submit Search" className="flex h-10 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition hover:from-blue-700 hover:to-indigo-700 sm:h-11 sm:w-14">
                        <Search size={18} strokeWidth={2.5}/>
                    </button>
                </form>

                {/* Right Side Icons */}
                <div className="order-1 ml-auto flex shrink-0 items-center gap-1 sm:order-3 sm:gap-2 lg:gap-4">

                    {/* Wishlist */}
                    <Link to="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`} className="relative flex flex-col items-center gap-1 rounded-lg p-2 text-gray-800 transition hover:text-blue-600">
                        <span className="relative">
                            <Heart size={22} strokeWidth={1.8}/>

                            {wishlist.length > 0 && (
                                <span className='absolute -right-2 -top-2 flex h-4 min-w-4 items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white'>
                                    {wishlist.length}
                                </span>
                            )}
                        </span>

                        <span className='hidden text-xs font-medium lg:block'>Wishlist</span>
                    </Link>

                    {/* Cart */}
                    <Link to='/cart' aria-label={`Shopping cart, ${cartCount} items`} className="group relative flex flex-col items-center gap-1 rounded-lg p-2 text-gray-800 transition hover:text-blue-600">
                            <span className='relative'>
                                <ShoppingCart size={22} strokeWidth={1.8}/>

                                {cartCount > 0 && (
                                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </span>
                            <span className="hidden text-xs font-medium lg:block">
                                Cart
                            </span>
                    </Link>

                    {/* Account */}
                    <Link to={user ? '/profile' : '/login'} aria-label={user ? 'My profile' : 'Log in'} className='flex flex-col items-center gap-1 rounded-lg p-2 text-gray-800 transition hover:text-blue-600'>
                        <UserRound size={22} strokeWidth={1.8} />
                        <span className="hidden max-w-[90px] truncate text-xs font-medium lg:block">
                            {user ? user.name.split(' ')[0] : 'Account'}
                        </span>
                    </Link>
                </div>
            </nav>
        </header>
    )

}

export default Navbar;
