export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, email, idioma } = req.body;

  if (!nome || !email || !idioma) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Determinar qual chave e lista usar baseado no idioma
    const brevoConfig = {
      'pt-br': {
        apiKey: process.env.BREVO_API_KEY_PT,
        listId: 8,
        formspreeId: 'xdeokbql'
      },
      'en-au': {
        apiKey: process.env.BREVO_API_KEY_EN,
        listId: 9,
        formspreeId: 'mqpkanrg'
      }
    };

    const config = brevoConfig[idioma];
    if (!config) {
      return res.status(400).json({ error: 'Invalid language' });
    }

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
        listIds: [config.listId],
        updateEnabled: true
      })
    });

    if (!brevoResponse.ok) {
      console.error('Brevo error:', await brevoResponse.text());
      // Continuar mesmo se Brevo falhar, para não bloquear o usuário
    }

    // Enviar para Formspree como backup
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

    return res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
