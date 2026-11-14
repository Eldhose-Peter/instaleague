'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  Calendar,
  Trophy,
  Users,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
  } = useStore();

  const [typeFilter, setTypeFilter] = useState<'all' | 'fixture' | 'registration' | 'result' | 'system'>('all');

  const userNotifications = notifications.filter(
    (n) => !currentUser || n.user_id === currentUser.id
  );

  const filteredNotifications = userNotifications.filter((n) => {
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Player &amp; Team Alerts
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Notifications Center</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Stay updated with fixture schedules, match scores, and tournament registration decisions.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
          >
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60">
        {(['all', 'fixture', 'registration', 'result', 'system'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
              typeFilter === type
                ? 'bg-emerald-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {type}s
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center text-xs text-zinc-500">
            No notifications found in this category.
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            return (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400'
                    : 'bg-zinc-900 border-emerald-500/40 text-zinc-200 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        notif.type === 'fixture'
                          ? 'bg-blue-500/20 text-blue-400'
                          : notif.type === 'result'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : notif.type === 'registration'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {notif.type === 'fixture' && <Calendar className="h-4 w-4" />}
                      {notif.type === 'result' && <Activity className="h-4 w-4" />}
                      {notif.type === 'registration' && <Users className="h-4 w-4" />}
                      {notif.type === 'system' && <Trophy className="h-4 w-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm font-bold ${
                            notif.read ? 'text-zinc-200' : 'text-white'
                          }`}
                        >
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                        {notif.message}
                      </p>
                      {notif.link && (
                        <div className="pt-2">
                          <Link
                            href={notif.link}
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                          >
                            View Link <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] text-zinc-500 whitespace-nowrap">
                    {formatDate(notif.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
