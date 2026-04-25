import { NextResponse } from 'next/server';
import { Resend } from 'resend';

type ContactBody = {
	name?: string;
	email?: string;
	message?: string;
};

function isValidEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

export async function POST(request: Request) {
	const apiKey = process.env.RESEND_API_KEY;
	const toRaw = process.env.CONTACT_TO_EMAIL;
	const from = process.env.CONTACT_FROM_EMAIL ?? 'HelioSync <onboarding@resend.dev>';

	if (!apiKey) {
		return NextResponse.json({ message: 'RESEND_API_KEY nao configurada no servidor.' }, { status: 500 });
	}

	if (!toRaw) {
		return NextResponse.json({ message: 'CONTACT_TO_EMAIL nao configurado no servidor.' }, { status: 500 });
	}

	const body = (await request.json().catch(() => null)) as ContactBody | null;

	if (!body) {
		return NextResponse.json({ message: 'Payload invalido.' }, { status: 400 });
	}

	const name = body.name?.trim();
	const email = body.email?.trim();
	const message = body.message?.trim();

	if (!name || !email || !message) {
		return NextResponse.json({ message: 'Preencha todos os campos.' }, { status: 400 });
	}

	if (!isValidEmail(email)) {
		return NextResponse.json({ message: 'Informe um e-mail valido.' }, { status: 400 });
	}

	const to = toRaw
		.split(',')
		.map(value => value.trim())
		.filter(Boolean);

	if (to.length === 0) {
		return NextResponse.json({ message: 'CONTACT_TO_EMAIL nao possui destinatarios validos.' }, { status: 500 });
	}

	const safeName = escapeHtml(name);
	const safeEmail = escapeHtml(email);
	const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');

	const resend = new Resend(apiKey);
	const { error } = await resend.emails.send({
		from,
		to,
		replyTo: email,
		subject: `[HelioSync] Novo contato de ${name}`,
		html: `
			<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
				<h2 style="margin: 0 0 16px;">Novo contato pelo site HelioSync</h2>
				<p style="margin: 0 0 8px;"><strong>Nome:</strong> ${safeName}</p>
				<p style="margin: 0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
				<p style="margin: 16px 0 8px;"><strong>Mensagem:</strong></p>
				<p style="margin: 0; white-space: normal;">${safeMessage}</p>
			</div>
		`,
	});

	if (error) {
		return NextResponse.json({ message: 'Nao foi possivel enviar o e-mail no momento.' }, { status: 502 });
	}

	return NextResponse.json({ ok: true });
}
