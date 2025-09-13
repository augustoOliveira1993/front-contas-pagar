import {
  IconHelp,
  IconCoins,
  IconCamera,
  IconFileAi,
  IconDialpad,
  IconSettings,
  IconDoorEnter,
  IconUsersGroup,
  IconStackFront,
  IconUserFilled,
  IconShieldLock,
  IconListDetails,
  IconFileAnalytics,
  IconSettingsCheck,
  IconShoppingCartUp,
  IconChartPieFilled,
  IconFileDescription,
} from "@tabler/icons-react";

export const siteConfig = {
  developer: "A&A Soluções",
  title: "Corpus Motel | A&A Soluções",
  name: "Corpus Motel",
  description: "Sistema Corpus",
  url: "https://www.corpusmotel.com.br",
  ogImage: "https://www.corpusmotel.com.br/og-image.jpg",
  links: {
    twitter: "https://twitter.com/aa_solucoes",
    facebook: "https://www.facebook.com/aa.solucoes",
    instagram: "https://www.instagram.com/aa.solucoes",
  },
};

export const SIDEBAR_PAGES = {
  user: {
    name: "Username",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Painel Administrativo",
      disabled: false,
      url: "/dashboard",
      icon: IconChartPieFilled,
    },
    {
      title: "Quartos / Apartamentos",
      url: "/rooms",
      icon: IconListDetails,
    },
    {
      title: "Controle de Estoque",
      disabled: true,
      url: "#",
      icon: IconStackFront,
    },
    {
      title: "Recepção",
      disabled: true,
      url: "#",
      icon: IconDoorEnter,
    },
    {
      title: "Clientes / Fornecedores",
      disabled: true,
      url: "#",
      icon: IconUsersGroup,
    },
    {
      title: "Relatórios",
      disabled: true,
      url: "#",
      icon: IconFileAnalytics,
    },
    {
      title: "Compras / Entradas",
      disabled: true,
      url: "#",
      icon: IconShoppingCartUp,
    },
    {
      title: "Financeiro",
      disabled: true,
      url: "#",
      icon: IconCoins,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      disabled: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          disabled: true,
          url: "#",
        },
        {
          title: "Archived",
          disabled: true,
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      disabled: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          disabled: true,
          url: "#",
        },
        {
          title: "Archived",
          disabled: true,
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      disabled: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          disabled: true,
          url: "#",
        },
        {
          title: "Archived",
          disabled: true,
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      disabled: true,
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Ajuda",
      disabled: true,
      url: "#",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Controle de Usuários",
      disabled: true,
      url: "/users",
      icon: IconUserFilled,
    },
    {
      name: "Papeis (Roles)",
      disabled: true,
      url: "/users/roles",
      icon: IconSettingsCheck,
    },
    {
      name: "Permissões",
      disabled: true,
      url: "/users/permissions",
      icon: IconShieldLock,
    },
    {
      name: "Módulos (Grupos de Permissões)",
      disabled: true,
      url: "/users/modules",
      icon: IconDialpad,
    },
  ],
};
