'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  CheckCircle,
  Menu,
  Shield,
  Trophy,
  Users,
  X,
  BookOpen,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { useStore } from '@/lib/store';

export function Navbar() {
  const pathname = usePathname();
  const {
    currentUser,
    setCurrentUser,
    profiles,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetToDefaultData,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Filter notifications for current user or general
  const userNotifications = notifications.filter(
    (n) => !currentUser || n.user_id === currentUser.id
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const navLinks = [
    { label: 'Tournaments', href: '/tournaments', icon: Trophy },
    { label: 'Teams', href: '/teams', icon: Users },
    { label: 'Rules & Guidelines', href: '/rules', icon: BookOpen },
  ];

  const isOrganizer = currentUser?.role === 'organizer';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-zinc-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                INSTA<span className="text-emerald-400">LEAGUE</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400">
                Football Tournaments
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800/80 text-emerald-400'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}

            {/* Admin link */}
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ml-2 ${
                pathname.startsWith('/admin')
                  ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Shield className="h-4 w-4 text-emerald-400" />
              Organizer Admin
              {isOrganizer && (
                <span className="ml-1 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Right side tools */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserDropdownOpen(false);
              }}
              aria-label="Notifications"
              className="relative p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors focus:outline-none"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-zinc-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-4 text-zinc-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-emerald-400" />
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400 font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {userNotifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500">
                      No notifications yet
                    </div>
                  ) : (
                    userNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 rounded-lg border text-xs transition-colors cursor-pointer ${
                          notif.read
                            ? 'bg-zinc-950/40 border-zinc-800/60 text-zinc-400'
                            : 'bg-zinc-800/60 border-emerald-500/30 text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold mb-1">
                          <span className={notif.read ? 'text-zinc-300' : 'text-emerald-400'}>
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {new Date(notif.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="line-clamp-2 leading-relaxed text-zinc-300">
                          {notif.message}
                        </p>
                        {notif.link && (
                          <Link
                            href={notif.link}
                            onClick={() => setNotificationsOpen(false)}
                            className="mt-2 inline-block text-[11px] font-medium text-emerald-400 hover:underline"
                          >
                            View Details →
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-800 text-center">
                  <Link
                    href="/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User & Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setUserDropdownOpen(!userDropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 transition-colors text-left"
            >
              <div className="h-7 w-7 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300 overflow-hidden">
                {currentUser?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  currentUser?.full_name?.charAt(0) || 'G'
                )}
              </div>
              <div className="hidden sm:flex flex-col text-xs leading-tight">
                <span className="font-semibold text-zinc-200">
                  {currentUser?.full_name || 'Guest User'}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  {currentUser?.role || 'Guest'}
                </span>
              </div>
            </button>

            {/* Role Switcher Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-3 text-zinc-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="pb-2 mb-2 border-b border-zinc-800">
                  <div className="text-[11px] uppercase font-bold tracking-wider text-zinc-400">
                    Switch Active Persona (Demo)
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Test the app from any perspective:
                  </p>
                </div>

                <div className="space-y-1">
                  {profiles.slice(0, 4).map((p) => {
                    const isSelected = currentUser?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCurrentUser(p);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                          isSelected
                            ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold'
                            : 'hover:bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-left">
                          <UserCheck
                            className={`h-4 w-4 ${
                              isSelected ? 'text-emerald-400' : 'text-zinc-500'
                            }`}
                          />
                          <div>
                            <div>{p.full_name}</div>
                            <div className="text-[10px] text-zinc-400">
                              {p.email}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                            p.role === 'organizer'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : p.role === 'captain'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          {p.role}
                        </span>
                      </button>
                    );
                  })}

                  {/* Guest option */}
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-xs hover:bg-zinc-800 text-zinc-400"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="h-4 w-4 text-zinc-500" />
                      View as Guest (Logged Out)
                    </span>
                  </button>
                </div>

                {/* Reset Data Button */}
                <div className="mt-2 pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      resetToDefaultData();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-center py-1.5 text-[11px] text-zinc-400 hover:text-rose-400 transition-colors"
                  >
                    Reset Demo Data to Defaults
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              pathname.startsWith('/admin')
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <Shield className="h-5 w-5 text-emerald-400" />
            Organizer Admin
          </Link>
        </div>
      )}
    </header>
  );
}
