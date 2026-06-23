import express from 'express'

const stringifyJiraDescription = (value: any): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value.plainText === 'string') return value.plainText
  if (Array.isArray(value)) return value.map(stringifyJiraDescription).join('')

  if (value.type === 'text') {
    return typeof value.text === 'string' ? value.text : ''
  }

  if (value.content) {
    const contentText = stringifyJiraDescription(value.content)
    if (value.type === 'paragraph' || value.type === 'heading' || value.type === 'bulletList' || value.type === 'orderedList') {
      return contentText + '\n'
    }
    return contentText
  }

  return ''
}

export const jiraRouter = express.Router()

jiraRouter.post('/search', async (req: express.Request, res: express.Response) => {
  try {
    const { baseUrl, email, apiKey } = req.body

    if (!baseUrl || !email || !apiKey) {
      res.status(400).json({ error: 'baseUrl, email, and apiKey are required' })
      return
    }

    const normalizedBaseUrl = String(baseUrl).replace(/\/$/, '')
    const url = `${normalizedBaseUrl}/rest/api/3/search/jql`
    const auth = Buffer.from(`${email}:${apiKey}`).toString('base64')

    const jiraResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jql: 'issuetype = Story ORDER BY updated DESC',
        maxResults: 50,
        fields: ['summary', 'description']
      })
    })

    if (!jiraResponse.ok) {
      const body = await jiraResponse.text().catch(() => '')
      res.status(jiraResponse.status).json({ error: `Jira API error: ${jiraResponse.status} ${jiraResponse.statusText} ${body}`.trim() })
      return
    }

    const data = await jiraResponse.json() as { issues?: Array<{ key: string; id: string; fields?: { summary?: string; description?: any } }> }
    const issues = (data.issues || []).map((issue) => ({
      key: issue.key,
      id: issue.id,
      summary: issue.fields?.summary || '',
      description: stringifyJiraDescription(issue.fields?.description) || ''
    }))

    res.json({ issues })
  } catch (error) {
    console.error('Jira proxy error:', error)
    res.status(502).json({ error: 'Failed to fetch Jira stories via backend proxy' })
  }
})
