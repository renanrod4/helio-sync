import type { Metadata, Viewport } from 'next';
import './layout.css';
import { Analytics } from '@vercel/analytics/next';

const seo = {
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
	siteName: 'Helio Sync',
	title: 'Helio Sync | Plataforma Inteligente de Gestão Solar',
	defaultDescription:
		'Placas Solares que rastreiam o sol por meios de cálulos matematicos e podem ser monitoradas e controladas em tempo real',
	image: '/images/logo.png',
};

export const metadata: Metadata = {
	metadataBase: new URL(seo.siteUrl),
	applicationName: seo.siteName,
	title: seo.title,
	description: seo.defaultDescription,
	keywords: [
		'helio sync',
		'software de energia solar',
		'energia solar',
		'energia solar residencial',
		'plataforma de gestão solar',
		'placa fotovoltaica',
		'monitoramento solar',
		'automação solar',
		'monitoramento de dispositivos',
		'eficiencia energética',
		'lótus',
		'São Paulo',
		'São Roque',
		'Vargem Grande Paulista',
	],
	category: 'technology',
	authors: [
		{ name: 'Renan Rodrigues de Meneses', url: 'https://renanrod.vercel.app' },
		{ name: 'Igor Martins Leocádio', url: 'https://www.linkedin.com/in/igor-leoc%C3%A1dio-a68107329/' },
		{ name: 'Gabriel Chagas Madureira', url: 'https://www.linkedin.com/in/gabriel-chagas-300b66352/' },
		{ name: 'Pedro Henrique Resende Gomes', url: 'https://github.com/percels' },
		{ name: 'Nícolas de Camargo Pedroso', url: '' },
		{ name: 'Miguel Henrique dos Santos de Oliveira Moreira', url: 'https://github.com/Miguel0971' },
		{ name: 'Samuel de Arruda Martins', url: 'https://www.linkedin.com/in/samuel-de-arruda-653671228/' },
		{ name: 'Vitória Sandei', url: '' },
	],
	creator: seo.siteName,
	publisher: seo.siteName,
	robots: {
		index: true,
		follow: true,
	},
	icons: {
		icon: seo.image,
		shortcut: seo.image,
		apple: seo.image,
	},
};

export const viewport: Viewport = {
	colorScheme: 'dark',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body>
				{children}
        <Analytics />
				<script type="application/ld+json">
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'SoftwareApplication',
						name: seo.siteName,
						applicationCategory: 'BusinessApplication',
						operatingSystem: 'Web',
						inLanguage: 'pt-BR',
						url: seo.siteUrl,
						description: seo.defaultDescription,
						featureList: [
							'Dashboard operacional com status em tempo real',
							'Gestão de dispositivos e inventário inteligente',
							'Histórico de eficiência energética',
							'Comandos remotos e resposta fisica integrada',
							'Automação personalizada para otimização de energia',
							'Alertas e notificações proativas para manutenção',
						],
						publisher: {
							'@type': 'Organization',
							name: seo.siteName,
							url: seo.siteUrl,
							logo: `${seo.siteUrl}${seo.image}`,
						},
					})}
				</script>
			</body>
		</html>
	);
}
