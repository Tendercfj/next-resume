import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react';

import { PrintButton } from '@/components/print-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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

  return (
    <header className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="size-20" size="lg">
            {profile.avatarUrl ? (
              <AvatarImage
                src={profile.avatarUrl}
                alt={`${profile.ownerName} 的头像`}
              />
            ) : null}
            <AvatarFallback className="text-lg">
              {getInitials(profile.ownerName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-2">
            <Badge variant="secondary" className="w-fit">
              {usingFallbackData ? '示例简历' : profile.title}
            </Badge>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                {profile.ownerName}
              </h1>
              {profile.headline ? (
                <p className="text-xl text-muted-foreground">
                  {profile.headline}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        {profile.summary ? (
          <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg whitespace-pre-wrap">
            {profile.summary}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {contactItems.map((item) => (
            <ContactBadge key={item.label} item={item} />
          ))}
        </div>
        <div className="flex flex-col gap-3 print:hidden sm:flex-row">
          {profile.email ? (
            <Button asChild className="cursor-pointer">
              <a href={`mailto:${profile.email}`}>
                <Mail data-icon="inline-start" />
                联系我
              </a>
            </Button>
          ) : null}
          <PrintButton />
        </div>
      </div>
      <ProfileLinks links={getProfileLinks(profile, links)} />
    </header>
  );
}

type ContactItem = {
  label: string;
  icon: LucideIcon;
};

function ContactBadge({ item }: { item: ContactItem }) {
  const Icon = item.icon;

  return (
    <Badge variant="outline" className="gap-1.5">
      <Icon className="size-3.5" aria-hidden="true" />
      <span className="max-w-[18rem] truncate">{item.label}</span>
    </Badge>
  );
}

function ProfileLinks({ links }: { links: ResumeLink[] }) {
  return (
    <aside className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-sm shadow-sm">
      <div className="flex items-center gap-2 font-medium">
        <Sparkles className="size-4 text-primary" aria-hidden="true" />
        快速入口
      </div>
      <Separator />
      <div className="flex flex-col gap-1">
        {links.map((link) => (
          <ExternalTextLink key={link.label} link={link} />
        ))}
      </div>
    </aside>
  );
}

function ExternalTextLink({ link }: { link: ResumeLink }) {
  return (
    <a
      key={link.id}
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      className="flex min-w-0 cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-2 text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex min-w-0 items-center gap-2">
        <Globe2 className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{link.label}</span>
      </span>
      <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
    </a>
  );
}

function getContactItems(profile: ResumeProfile): ContactItem[] {
  return [
    profile.location
      ? {
          label: profile.location,
          icon: MapPin,
        }
      : null,
    profile.email
      ? {
          label: profile.email,
          icon: Mail,
        }
      : null,
    profile.phone
      ? {
          label: profile.phone,
          icon: Phone,
        }
      : null,
  ].filter(Boolean) as ContactItem[];
}
