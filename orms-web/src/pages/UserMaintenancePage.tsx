import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { businessUnitService } from '../services/businessUnitService'
import { userService } from '../services/userService'
import { QUERY_KEYS } from '../constants/routes'
import { AppRole } from '../types/enums'
import type { User, UserMaintenanceInput } from '../types/user.types'

const roleOptions = [
  { id: 1, label: 'Administrator', value: AppRole.ADMIN },
  { id: 2, label: 'Risk Manager', value: AppRole.RISK_MANAGER },
  { id: 3, label: 'Compliance Officer', value: AppRole.COMPLIANCE_OFFICER },
  { id: 4, label: 'Auditor', value: AppRole.AUDITOR },
]

const emptyForm: UserMaintenanceInput = {
  username: '',
  fullName: '',
  email: '',
  password: '',
  roleId: 2,
  businessUnitId: null,
  isActive: true,
}

export default function UserMaintenancePage() {
  const queryClient = useQueryClient()
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form, setForm] = useState<UserMaintenanceInput>(emptyForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const usersQuery = useQuery({ queryKey: [QUERY_KEYS.users], queryFn: userService.getAll })
  const businessUnitsQuery = useQuery({ queryKey: [QUERY_KEYS.businessUnits], queryFn: businessUnitService.getAll })
  const saveMutation = useMutation({
    mutationFn: () => editingUser ? userService.update(editingUser.id, { ...form, password: form.password || undefined }) : userService.create(form),
    onSuccess: () => {
      setMessage(editingUser ? 'User updated successfully.' : 'User created successfully.')
      setError('')
      resetForm()
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users] })
    },
    onError: () => setError('Unable to save the user. Check the details and try again.'),
  })
  const deleteMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      setMessage('User deactivated.')
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users] })
    },
    onError: () => setError('Unable to deactivate the user.'),
  })

  const users = usersQuery.data?.success ? usersQuery.data.data : []
  const businessUnits = businessUnitsQuery.data?.success ? businessUnitsQuery.data.data : []

  function resetForm() {
    setEditingUser(null)
    setForm(emptyForm)
  }

  const editUser = (user: User) => {
    setEditingUser(user)
    setMessage('')
    setError('')
    setForm({ username: user.username, fullName: user.fullName, email: user.email, password: '', roleId: user.roleId, businessUnitId: user.businessUnitId ?? null, isActive: user.isActive })
  }

  const updateField = <T extends keyof UserMaintenanceInput>(field: T, value: UserMaintenanceInput[T]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <section className="user-maintenance-page">
      <header className="user-maintenance-header">
        <div><p className="eyebrow">Administration</p><h1>User Maintenance</h1><p>Create and maintain user access, role assignment, and business-unit ownership.</p></div>
        <div className="user-maintenance-meta"><span>Access control</span><strong>{users.length} users</strong><small>Password hashes remain server-managed</small></div>
      </header>

      <div className="user-maintenance-layout">
        <section className="user-maintenance-panel">
          <div className="user-maintenance-panel-heading"><div><p className="eyebrow">Directory</p><h2>Application users</h2></div><span>{users.length} records</span></div>
          {usersQuery.isLoading ? <p>Loading users…</p> : null}
          {usersQuery.error ? <p className="user-maintenance-error">Unable to load users.</p> : null}
          <div className="user-table-wrap"><table className="user-table"><thead><tr><th>User</th><th>Role</th><th>Business unit</th><th>Status</th><th>Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><strong>{user.fullName}</strong><small>{user.username} · {user.email}</small></td><td>{user.role?.name ?? roleOptions.find((role) => role.id === user.roleId)?.label ?? `Role ${user.roleId}`}</td><td>{user.businessUnit?.name ?? 'Unassigned'}</td><td><span className={`user-status ${user.isActive ? 'active' : 'inactive'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td><td><div className="user-row-actions"><button type="button" className="secondary-button" onClick={() => editUser(user)}>Edit</button><button type="button" className="secondary-button" onClick={() => { if (window.confirm(`Deactivate ${user.fullName}?`)) deleteMutation.mutate(user.id) }} disabled={deleteMutation.isPending || !user.isActive}>Deactivate</button></div></td></tr>)}</tbody></table></div>
        </section>

        <section className="user-maintenance-panel user-form-panel">
          <div className="user-maintenance-panel-heading"><div><p className="eyebrow">{editingUser ? 'Edit record' : 'New record'}</p><h2>{editingUser ? 'Update user' : 'Create user'}</h2></div>{editingUser ? <button type="button" className="modal-close" onClick={resetForm} aria-label="Cancel editing">×</button> : null}</div>
          <form className="user-maintenance-form" onSubmit={(event) => { event.preventDefault(); setMessage(''); setError(''); saveMutation.mutate() }}>
            <label className="field">Username *<input required value={form.username} onChange={(event) => updateField('username', event.target.value)} autoComplete="username" /></label>
            <label className="field">Full name *<input required value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} /></label>
            <label className="field">Email *<input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} autoComplete="email" /></label>
            <label className="field">{editingUser ? 'New password' : 'Password *'}<input required={!editingUser} type="password" minLength={8} value={form.password} onChange={(event) => updateField('password', event.target.value)} autoComplete={editingUser ? 'new-password' : 'new-password'} placeholder={editingUser ? 'Leave blank to keep current password' : 'Minimum 8 characters'} /></label>
            <label className="field">Role *<select required value={form.roleId} onChange={(event) => updateField('roleId', Number(event.target.value))}>{roleOptions.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}</select></label>
            <label className="field">Business unit<select value={form.businessUnitId ?? ''} onChange={(event) => updateField('businessUnitId', event.target.value ? Number(event.target.value) : null)}><option value="">Unassigned</option>{businessUnits.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}</select></label>
            <label className="user-active-toggle"><input type="checkbox" checked={form.isActive} onChange={(event) => updateField('isActive', event.target.checked)} /> Account is active</label>
            {error ? <p className="user-maintenance-error" role="alert">{error}</p> : null}
            {message ? <p className="user-maintenance-success" role="status">{message}</p> : null}
            <div className="user-form-actions"><button type="button" className="secondary-button" onClick={resetForm} disabled={saveMutation.isPending}>Clear</button><button type="submit" className="primary-button" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving…' : editingUser ? 'Save changes' : 'Create user'}</button></div>
          </form>
        </section>
      </div>
    </section>
  )
}
