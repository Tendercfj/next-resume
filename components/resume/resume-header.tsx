import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';

import { PrintButton } from '@/components/print-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/resume/formatters';
import { getProfileLinks } from '@/lib/resume/profile-links';
import type { ResumeLink, ResumeProfile } from '@/lib/resume/types';

type ResumeHeaderProps = {
  profile: ResumeProfile;
  links: ResumeLink[];
  usingFallbackData: boolean;
};

export function ResumeHeader({
  profile,
  links,
  usingFallbackData,
}: ResumeHeaderProps) {
  const contactItems = getContactItems(profile);
  const profileLinks = getDisplayLinks(getProfileLinks(profile, links));

  return (
    <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start print:grid-cols-[minmax(0,1fr)_12rem] print:gap-5">
      <div className="flex min-w-0 flex-col gap-7 print:gap-3">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start print:flex-row print:gap-3">
          <Avatar
            className="size-20 shrink-0 rounded-2xl ring-1 ring-border print:size-12 print:rounded-xl"
            size="lg"
          >
            {profile.avatarUrl ? (
              <AvatarImage
                src={profile.avatarUrl}
                alt={`${profile.ownerName} 的头像`}
                className="rounded-2xl"
              />
            ) : null}
            <AvatarFallback className="rounded-2xl bg-foreground text-xl font-semibold text-background print:rounded-xl print:text-sm">
              {getInitials(profile.ownerName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-3 print:gap-1.5">
            {usingFallbackData ? (
              <span className="w-fit rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary print:px-0 print:py-0 print:text-[0.6rem]">
                示例简历
              </span>
            ) : profile.title ? (
              <span className="w-fit rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary print:px-0 print:py-0 print:text-[0.6rem]">
                {profile.title}
              </span>
            ) : null}
            <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-normal text-foreground sm:text-6xl print:text-3xl">
              {profile.ownerName}
            </h1>
            {profile.headline ? (
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg print:text-[0.78rem] print:leading-4">
                {profile.headline}
              </p>
            ) : null}

            {profileLinks.length > 0 ? (
              <nav
                aria-label="个人链接"
                className="flex flex-wrap gap-2 pt-1 print:gap-x-3 print:gap-y-1 print:pt-0"
              >
                {profileLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-muted/45 px-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/35 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 print:h-auto print:border-0 print:bg-transparent print:px-0 print:text-[0.72rem]"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight
                      className="size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </nav>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:mt-10 lg:items-end print:mt-0 print:gap-1.5">
        <div className="grid gap-2 text-sm text-muted-foreground lg:justify-items-end print:gap-1 print:text-[0.72rem]">
          {contactItems.map((item) => (
            <ContactItem key={item.label} item={item} />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <ThemeToggle />
          {profile.email ? (
            <Button asChild size="sm" className="cursor-pointer rounded-full">
              <a href={`mailto:${profile.email}`}>
                <Mail className="size-3.5" aria-hidden="true" />
                联系我
              </a>
            </Button>
          ) : null}
          <PrintButton />
        </div>
      </div>
    </header>
  );
}

type ContactItem = {
  label: string;
  icon: LucideIcon;
};

function ContactItem({ item }: { item: ContactItem }) {
  const Icon = item.icon;
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      <span className="min-w-0 break-words">{item.label}</span>
    </span>
  );
}

function getContactItems(profile: ResumeProfile): ContactItem[] {
  return [
    profile.location ? { label: profile.location, icon: MapPin } : null,
    profile.email ? { label: profile.email, icon: Mail } : null,
    profile.phone ? { label: profile.phone, icon: Phone } : null,
  ].filter(Boolean) as ContactItem[];
}

function getDisplayLinks(links: ResumeLink[]) {
  const seenLabels = new Set<string>();

  return links.filter((link) => {
    const label = link.label.trim().toLowerCase();

    if (seenLabels.has(label)) {
      return false;
    }

    seenLabels.add(label);
    return true;
  });
}
