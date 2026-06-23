import { useState, useEffect } from 'react'
import { generateTests } from './api'
import { GenerateRequest, GenerateResponse, TestCase } from './types'

function App() {
  const [formData, setFormData] = useState<GenerateRequest>({
    storyTitle: '',
    acceptanceCriteria: '',
    description: '',
    additionalInfo: ''
  })
  const [results, setResults] = useState<GenerateResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedTestCases, setExpandedTestCases] = useState<Set<string>>(new Set())
  // Jira integration (UI-only)
  const [jiraModalOpen, setJiraModalOpen] = useState(false)
  const [jiraConfig, setJiraConfig] = useState({ baseUrl: '', email: '', apiKey: '' })
  const [jiraStories, setJiraStories] = useState<Array<{ key: string; id: string; summary: string; description?: string }>>([])
  const [isConnectingJira, setIsConnectingJira] = useState(false)
  const [jiraError, setJiraError] = useState<string | null>(null)

  const toggleTestCaseExpansion = (testCaseId: string) => {
    const newExpanded = new Set(expandedTestCases)
    if (newExpanded.has(testCaseId)) {
      newExpanded.delete(testCaseId)
    } else {
      newExpanded.add(testCaseId)
    }
    setExpandedTestCases(newExpanded)
  }

  useEffect(() => {
    // load saved jira config from localStorage (UI-only)
    try {
      const raw = localStorage.getItem('jiraConfig')
      if (raw) {
        const parsed = JSON.parse(raw)
        setJiraConfig(parsed)
        // auto-fetch stories if config exists
        if (parsed.baseUrl && parsed.email && parsed.apiKey) {
          fetchJiraStories(parsed)
        }
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const openJiraModal = () => setJiraModalOpen(true)
  const closeJiraModal = () => setJiraModalOpen(false)

  const handleJiraInputChange = (field: 'baseUrl' | 'email' | 'apiKey', value: string) => {
    setJiraConfig(prev => ({ ...prev, [field]: value }))
  }

  const fetchJiraStories = async (configOverride?: { baseUrl: string; email: string; apiKey: string }, showErrorsInUI = true) => {
    const cfg = configOverride || jiraConfig
    if (!cfg.baseUrl || !cfg.email || !cfg.apiKey) {
      if (showErrorsInUI) setJiraError('Base URL, Email and API Key are required')
      return
    }
    setIsConnectingJira(true)
    setJiraError(null)
    try {
      const res = await fetch('/api/jira/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          baseUrl: cfg.baseUrl,
          email: cfg.email,
          apiKey: cfg.apiKey
        })
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Unknown error' }))
        const msg = body.error || `Jira proxy error: HTTP ${res.status}`
        if (showErrorsInUI) setJiraError(msg)
        throw new Error(msg)
      }
      const data = await res.json()
      const issues = (data.issues || []).map((it: any) => ({
        key: it.key,
        id: it.id,
        summary: it.summary || '',
        description: it.description || ''
      }))
      setJiraStories(issues)
      if (issues.length === 0 && showErrorsInUI) setJiraError('No stories returned from Jira')
    } catch (err) {
      if (err instanceof TypeError) {
        const msg = 'Network error while contacting backend proxy. Make sure backend server is running.'
        if (showErrorsInUI) setJiraError(msg)
      } else {
        if (showErrorsInUI) setJiraError(err instanceof Error ? err.message : 'Failed to fetch Jira stories')
      }
      throw err
    } finally {
      setIsConnectingJira(false)
    }
  }

  const connectJira = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    // save config to localStorage (UI-only)
    try {
      localStorage.setItem('jiraConfig', JSON.stringify(jiraConfig))
    } catch (e) {
      // ignore
    }
    try {
      await fetchJiraStories(jiraConfig)
      setJiraModalOpen(false)
    } catch (err) {
      // keep modal open so user can see error
    }
  }

  const disconnectJira = () => {
    setJiraStories([])
    setJiraConfig({ baseUrl: '', email: '', apiKey: '' })
    localStorage.removeItem('jiraConfig')
    setJiraError(null)
  }

  const selectJiraStory = (story: { key: string; id: string; summary: string; description?: string }) => {
    setFormData(prev => ({
      ...prev,
      storyTitle: story.summary || story.key,
      description: story.description || '',
      acceptanceCriteria: prev.acceptanceCriteria.trim() || story.description || ''
    }))
  }

  const handleInputChange = (field: keyof GenerateRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.storyTitle.trim() || !formData.acceptanceCriteria.trim()) {
      setError('Story Title and Acceptance Criteria are required')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await generateTests(formData)
      setResults(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tests')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background-color: #f5f5f5;
          color: #333;
          line-height: 1.6;
        }
        
        .container {
          max-width: 95%;
          width: 100%;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
        }
        
        @media (min-width: 768px) {
          .container {
            max-width: 90%;
            padding: 30px;
          }
        }
        
        @media (min-width: 1024px) {
          .container {
            max-width: 85%;
            padding: 40px;
          }
        }
        
        @media (min-width: 1440px) {
          .container {
            max-width: 1800px;
            padding: 50px;
          }
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .title {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        
        .subtitle {
          color: #666;
          font-size: 1.1rem;
        }
        
        .form-container {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #2c3e50;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e1e8ed;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3498db;
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .submit-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: #2980b9;
        }
        
        .submit-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }
        
        .error-banner {
          background: #e74c3c;
          color: white;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 18px;
        }
        
        .results-container {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .results-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e1e8ed;
        }
        
        .results-title {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        
        .results-meta {
          color: #666;
          font-size: 14px;
        }
        
        .table-container {
          overflow-x: auto;
        }
        
        .results-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        .results-table th,
        .results-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e1e8ed;
        }
        
        .results-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .results-table tr:hover {
          background: #f8f9fa;
        }
        
        .category-positive { color: #27ae60; font-weight: 600; }
        .category-negative { color: #e74c3c; font-weight: 600; }
        .category-edge { color: #f39c12; font-weight: 600; }
        .category-authorization { color: #9b59b6; font-weight: 600; }
        .category-non-functional { color: #34495e; font-weight: 600; }
        
        .test-case-id {
          cursor: pointer;
          color: #3498db;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background-color 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .test-case-id:hover {
          background: #f8f9fa;
        }
        
        .test-case-id.expanded {
          background: #e3f2fd;
          color: #1976d2;
        }
        
        .expand-icon {
          font-size: 10px;
          transition: transform 0.2s;
        }
        
        .expand-icon.expanded {
          transform: rotate(90deg);
        }
        
        .expanded-details {
          margin-top: 15px;
          background: #fafbfc;
          border: 1px solid #e1e8ed;
          border-radius: 8px;
          padding: 20px;
        }
        
        .step-item {
          background: white;
          border: 1px solid #e1e8ed;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .step-header {
          display: grid;
          grid-template-columns: 80px 1fr 1fr 1fr;
          gap: 15px;
          align-items: start;
        }
        
        .step-id {
          font-weight: 600;
          color: #2c3e50;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          text-align: center;
          font-size: 12px;
        }
        
        .step-description {
          color: #2c3e50;
          line-height: 1.5;
        }
        
        .step-test-data {
          color: #666;
          font-style: italic;
          font-size: 14px;
        }
        
        .step-expected {
          color: #27ae60;
          font-weight: 500;
          font-size: 14px;
        }
        
        .step-labels {
          display: grid;
          grid-template-columns: 80px 1fr 1fr 1fr;
          gap: 15px;
          margin-bottom: 10px;
          font-weight: 600;
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .jira-toolbar { display: flex; justify-content: flex-end; gap: 12px; margin-bottom: 12px; }
        .jira-btn { background: #2d6cdf; color: white; padding: 8px 12px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
        .jira-btn.secondary { background: #bdc3c7; color: #2c3e50; }
        .jira-list { background: white; border-radius: 8px; padding: 12px; margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .jira-item { padding: 10px; border-bottom: 1px solid #eef2f6; cursor: pointer; }
        .jira-item:hover { background: #f8f9fa; }
        .jira-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 60; }
        .jira-modal { background: white; border-radius: 8px; padding: 20px; width: 420px; box-shadow: 0 6px 24px rgba(0,0,0,0.2); }
        .jira-field { margin-bottom: 12px; }
        .jira-field label { display:block; font-weight:600; margin-bottom:6px }
        .jira-field input { width:100%; padding:8px; border:1px solid #e1e8ed; border-radius:6px }
      `}</style>
      
      <div className="container">
        <div className="header">
          <h1 className="title">User Story to Tests</h1>
          <p className="subtitle">Generate comprehensive test cases from your user stories</p>
        </div>

        <div className="jira-toolbar">
          {jiraStories.length > 0 ? (
            <>
              <button className="jira-btn secondary" onClick={disconnectJira}>Disconnect Jira</button>
              <button className="jira-btn" onClick={() => fetchJiraStories()}>Refresh Stories</button>
            </>
          ) : (
            <button className="jira-btn" onClick={openJiraModal}>{isConnectingJira ? 'Connecting...' : 'Connect Jira'}</button>
          )}
        </div>

        {jiraStories.length > 0 && (
          <div className="jira-list">
            <strong>Connected Jira Stories</strong>
            <div style={{marginTop: 8}}>
              {jiraStories.map(story => (
                <div key={story.id} className="jira-item" onClick={() => selectJiraStory(story)}>
                  <div style={{fontWeight:600}}>{story.summary || story.key}</div>
                  <div style={{color:'#666', fontSize:12}}>{story.key}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {jiraModalOpen && (
          <div className="jira-modal-backdrop" onClick={closeJiraModal}>
            <div className="jira-modal" onClick={(e) => e.stopPropagation()}>
              <h3 style={{marginTop:0}}>Connect to Jira (UI-only)</h3>
              <form onSubmit={connectJira}>
                <div className="jira-field">
                  <label>Base URL</label>
                  <input value={jiraConfig.baseUrl} onChange={(e) => handleJiraInputChange('baseUrl', e.target.value)} placeholder="https://your-domain.atlassian.net" />
                </div>
                <div className="jira-field">
                  <label>Email</label>
                  <input value={jiraConfig.email} onChange={(e) => handleJiraInputChange('email', e.target.value)} placeholder="your-email@example.com" />
                </div>
                <div className="jira-field">
                  <label>API Key</label>
                  <input value={jiraConfig.apiKey} onChange={(e) => handleJiraInputChange('apiKey', e.target.value)} placeholder="Jira API token" />
                </div>
                {jiraError && (
                  <div style={{background:'#fee', color:'#822', padding:10, borderRadius:6, marginBottom:8}}>
                    {jiraError}
                  </div>
                )}
                <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
                  <button type="button" className="jira-btn secondary" onClick={closeJiraModal}>Cancel</button>
                  <button type="button" className="jira-btn secondary" onClick={async () => {
                    setJiraError(null)
                    try {
                      await fetchJiraStories(jiraConfig, true)
                      setJiraError('Connection OK — stories fetched')
                    } catch (err) {
                      // error message already set in fetchJiraStories
                    }
                  }}>
                    Test Connection
                  </button>
                  <button type="submit" className="jira-btn">Connect</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="storyTitle" className="form-label">
              Story Title *
            </label>
            <input
              type="text"
              id="storyTitle"
              className="form-input"
              value={formData.storyTitle}
              onChange={(e) => handleInputChange('storyTitle', e.target.value)}
              placeholder="Enter the user story title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-textarea"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Additional description (optional)..."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="acceptanceCriteria" className="form-label">
              Acceptance Criteria *
            </label>
            <textarea
              id="acceptanceCriteria"
              className="form-textarea"
              value={formData.acceptanceCriteria}
              onChange={(e) => handleInputChange('acceptanceCriteria', e.target.value)}
              placeholder="Enter the acceptance criteria..."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="additionalInfo" className="form-label">
              Additional Info
            </label>
            <textarea
              id="additionalInfo"
              className="form-textarea"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Any additional information (optional)..."
            />
          </div>
          
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="loading">
            Generating test cases...
          </div>
        )}

        {results && (
          <div className="results-container">
            <div className="results-header">
              <h2 className="results-title">Generated Test Cases</h2>
              <div className="results-meta">
                {results.cases.length} test case(s) generated
                {results.model && ` • Model: ${results.model}`}
                {results.promptTokens > 0 && ` • Input tokens: ${results.promptTokens}`}
                {results.completionTokens > 0 && ` • Output tokens: ${results.completionTokens}`}
                {results.cost && ` • Cost: $${results.cost.totalCost.toFixed(6)}${results.cost.estimated ? ' (est.)' : ''}`}
              </div>
            </div>
            
            <div className="table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Test Case ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Expected Result</th>
                  </tr>
                </thead>
                <tbody>
                  {results.cases.map((testCase: TestCase) => (
                    <>
                      <tr key={testCase.id}>
                        <td>
                          <div 
                            className={`test-case-id ${expandedTestCases.has(testCase.id) ? 'expanded' : ''}`}
                            onClick={() => toggleTestCaseExpansion(testCase.id)}
                          >
                            <span className={`expand-icon ${expandedTestCases.has(testCase.id) ? 'expanded' : ''}`}>
                              ▶
                            </span>
                            {testCase.id}
                          </div>
                        </td>
                        <td>{testCase.title}</td>
                        <td>
                          <span className={`category-${testCase.category.toLowerCase()}`}>
                            {testCase.category}
                          </span>
                        </td>
                        <td>{testCase.expectedResult}</td>
                      </tr>
                      {expandedTestCases.has(testCase.id) && (
                        <tr key={`${testCase.id}-details`}>
                          <td colSpan={4}>
                            <div className="expanded-details">
                              <h4 style={{marginBottom: '15px', color: '#2c3e50'}}>Test Steps for {testCase.id}</h4>
                              <div className="step-labels">
                                <div>Step ID</div>
                                <div>Step Description</div>
                                <div>Test Data</div>
                                <div>Expected Result</div>
                              </div>
                              {testCase.steps.map((step, index) => (
                                <div key={index} className="step-item">
                                  <div className="step-header">
                                    <div className="step-id">S{String(index + 1).padStart(2, '0')}</div>
                                    <div className="step-description">{step}</div>
                                    <div className="step-test-data">{testCase.testData || 'N/A'}</div>
                                    <div className="step-expected">
                                      {index === testCase.steps.length - 1 ? testCase.expectedResult : 'Step completed successfully'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App