import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  Globe2,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

import { PrintButton } from '@/components/print-button';
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
  const profileLinks = getProfileLinks(profile, links);

  return (
    <header className="flex flex-col gap-8">
      {/* top row: avatar + name + links */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* left: avatar + name */}
        <div className="flex items-center gap-5">
          <Avatar className="size-16 shrink-0" size="lg">
            {profile.avatarUrl ? (
              <AvatarImage
                src={profile.avatarUrl}
                alt={`${profile.ownerName} 的头像`}
              />
            ) : null}
            <AvatarFallback className="text-base font-medium">
              {getInitials(profile.ownerName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            {usingFallbackData ? (
              <span className="text-xs font-medium uppercase tracking-widest text-primary">
                示例简历
              </span>
            ) : profile.title ? (
              <span className="text-xs font-medium uppercase tracking-widest text-primary">
                {profile.title}
              </span>
            ) : null}
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              {profile.ownerName}
            </h1>
            {profile.headline ? (
              <p className="text-base text-muted-foreground">
                {profile.headline}
              </p>
            ) : null}
          </div>
        </div>

        {/* right: profile links */}
        {profileLinks.length > 0 ? (
          <nav
            aria-label="个人链接"
            className="flex flex-col gap-0.5 sm:items-end"
          >
            {profileLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <Globe2 className="size-3.5 shrink-0" aria-hidden="true" />
                <span>{link.label}</span>
                <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
              </a>
            ))}
          </nav>
        ) : null}
      </div>

      {/* summary */}
      {profile.summary ? (
        <p className="max-w-2xl text-base leading-8 text-muted-foreground whitespace-pre-wrap">
          {profile.summary}
        </p>
      ) : null}

      {/* contact + actions row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {contactItems.map((item) => (
            <ContactItem key={item.label} item={item} />
          ))}
        </div>
        <div className="flex gap-2 print:hidden">
          {profile.email ? (
            <Button asChild size="sm" className="cursor-pointer">
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
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {item.label}
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
