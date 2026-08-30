export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, email, telefone, idioma, tipo } = req.body;

  if (!nome || !email || !idioma) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Determinar qual chave e lista usar baseado no idioma e tipo
    const brevoConfig = {
      'pt-br': {
        apiKey: process.env.BREVO_API_KEY_PT,
        book: { listId: 8, formspreeId: 'xdeokbql' },
        mentoria_individual: { listId: 10 },
        mentoria_corporativa: { listId: 11 }
      },
      'en-au': {
        apiKey: process.env.BREVO_API_KEY_EN,
        book: { listId: 9, formspreeId: 'mqpkanrg' },
        mentoria_individual: { listId: 12 },
        mentoria_corporativa: { listId: 13 }
      }
    };

    const langConfig = brevoConfig[idioma];
    if (!langConfig) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    // Escolher a configuração correta baseado no tipo
    let config = langConfig[tipo] || langConfig.book;
    if (!config) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    config.apiKey = langConfig.apiKey;

    // Enviar para Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': config.apiKey
      },
      body: JSON.stringify({
        email: email,
        firstName: nome,
        phone: telefone || null,
        listIds: [config.listId],
        updateEnabled: true
      })
    });

    if (!brevoResponse.ok) {
      console.error('Brevo error:', await brevoResponse.text());
      // Continuar mesmo se Brevo falhar, para não bloquear o usuário
    }

    // Enviar para Formspree como backup (apenas para formulário de livro)
    if (config.formspreeId) {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('email', email);

      const formspreeResponse = await fetch(`https://formspree.io/f/${config.formspreeId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!formspreeResponse.ok) {
        return res.status(500).json({ error: 'Failed to submit form' });
      }
    }

    return res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
