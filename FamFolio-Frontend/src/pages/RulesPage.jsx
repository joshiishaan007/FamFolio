"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const RulesPage = () => {
  // State for form data
  const [ruleName, setRuleName] = useState("")
  const [ruleType, setRuleType] = useState("")
  const [ruleDescription, setRuleDescription] = useState("")
  const [familyMember, setFamilyMember] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [conditions, setConditions] = useState([{ id: 1, type: "", operator: "", value: "" }])
  const [actions, setActions] = useState([{ id: 1, type: "", config: {} }])
  const [showToast, setShowToast] = useState(false)

  // Sample data for dropdowns
  const ruleTypes = ["SPENDING_LIMIT", "TIME_RESTRICTION", "CATEGORY_BLOCK", "MANUAL_APPROVAL", "CUSTOM"]
  const familyMembers = ["Mom", "Dad", "Child 1", "Child 2"]
  const conditionTypes = ["AMOUNT", "CATEGORY", "TIME", "DAY", "DATE", "MERCHANT", "CUSTOM"]
  const actionTypes = ["BLOCK", "NOTIFY", "REQUIRE_APPROVAL", "LIMIT_AMOUNT", "CUSTOM"]

  // Dynamic operators based on condition type
  const getOperators = (type) => {
    switch (type) {
      case "AMOUNT":
        return [">", "<", "=", ">=", "<=", "BETWEEN"]
      case "CATEGORY":
        return ["=", "IN", "NOT_IN"]
      case "TIME":
        return [">", "<", "BETWEEN"]
      case "DAY":
        return ["=", "IN", "NOT_IN"]
      case "DATE":
        return ["=", ">", "<", ">=", "<=", "BETWEEN"]
      case "MERCHANT":
        return ["=", "CONTAINS", "STARTS_WITH", "ENDS_WITH", "IN", "NOT_IN"]
      default:
        return []
    }
  }

  // Days of week for day picker
  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

  // Categories for category picker
  const categories = ["Groceries", "Entertainment", "Education", "Shopping", "Travel", "Food", "Utilities"]

  // Add condition
  const addCondition = () => {
    const newId = conditions.length > 0 ? Math.max(...conditions.map((c) => c.id)) + 1 : 1
    setConditions([...conditions, { id: newId, type: "", operator: "", value: "" }])
  }

  // Remove condition
  const removeCondition = (id) => {
    setConditions(conditions.filter((condition) => condition.id !== id))
  }

  // Add action
  const addAction = () => {
    const newId = actions.length > 0 ? Math.max(...actions.map((a) => a.id)) + 1 : 1
    setActions([...actions, { id: newId, type: "", config: {} }])
  }

  // Remove action
  const removeAction = (id) => {
    setActions(actions.filter((action) => action.id !== id))
  }

  // Update condition
  const updateCondition = (id, field, value) => {
    setConditions(
      conditions.map((condition) => {
        if (condition.id === id) {
          if (field === "type") {
            // Reset operator and value when type changes
            return { ...condition, [field]: value, operator: "", value: "" }
          }
          return { ...condition, [field]: value }
        }
        return condition
      }),
    )
  }

  // Update action
  const updateAction = (id, field, value) => {
    setActions(
      actions.map((action) => {
        if (action.id === id) {
          if (field === "type") {
            // Reset config when type changes
            return { ...action, [field]: value, config: {} }
          } else if (field.startsWith("config.")) {
            const configField = field.split(".")[1]
            return {
              ...action,
              config: {
                ...action.config,
                [configField]: value,
              },
            }
          }
          return { ...action, [field]: value }
        }
        return action
      }),
    )
  }

  // Render value input based on condition type and operator
  const renderValueInput = (condition) => {
    const { type, operator, value } = condition

    if (!type || !operator) return null

    switch (type) {
      case "AMOUNT":
        if (operator === "BETWEEN") {
          return (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
                placeholder="Min"
                value={value.min || ""}
                onChange={(e) => updateCondition(condition.id, "value", { ...value, min: e.target.value })}
              />
              <span>and</span>
              <input
                type="number"
                className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
                placeholder="Max"
                value={value.max || ""}
                onChange={(e) => updateCondition(condition.id, "value", { ...value, max: e.target.value })}
              />
            </div>
          )
        } else {
          return (
            <input
              type="number"
              className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
              placeholder="Amount"
              value={value || ""}
              onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
            />
          )
        }

      case "CATEGORY":
        if (operator === "IN" || operator === "NOT_IN") {
          return (
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-500 rounded focus:ring-blue-400"
                    checked={Array.isArray(value) && value.includes(category)}
                    onChange={(e) => {
                      const newValue = Array.isArray(value) ? [...value] : []
                      if (e.target.checked) {
                        newValue.push(category)
                      } else {
                        const index = newValue.indexOf(category)
                        if (index > -1) newValue.splice(index, 1)
                      }
                      updateCondition(condition.id, "value", newValue)
                    }}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          )
        } else {
          return (
            <select
              className="form-select rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
              value={value || ""}
              onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )
        }

      case "TIME":
        if (operator === "BETWEEN") {
          return (
            <div className="flex gap-2 items-center">
              <input
                type="time"
                className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
                value={value.start || ""}
                onChange={(e) => updateCondition(condition.id, "value", { ...value, start: e.target.value })}
              />
              <span>and</span>
              <input
                type="time"
                className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
                value={value.end || ""}
                onChange={(e) => updateCondition(condition.id, "value", { ...value, end: e.target.value })}
              />
            </div>
          )
        } else {
          return (
            <input
              type="time"
              className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
              value={value || ""}
              onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
            />
          )
        }

      case "DAY":
        if (operator === "IN" || operator === "NOT_IN") {
          return (
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map((day) => (
                <label key={day} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-500 rounded focus:ring-blue-400"
                    checked={Array.isArray(value) && value.includes(day)}
                    onChange={(e) => {
                      const newValue = Array.isArray(value) ? [...value] : []
                      if (e.target.checked) {
                        newValue.push(day)
                      } else {
                        const index = newValue.indexOf(day)
                        if (index > -1) newValue.splice(index, 1)
                      }
                      updateCondition(condition.id, "value", newValue)
                    }}
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          )
        } else {
          return (
            <select
              className="form-select rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
              value={value || ""}
              onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
            >
              <option value="">Select Day</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          )
        }

      case "DATE":
        if (operator === "BETWEEN") {
          return (
            <div className="flex gap-2 items-center">
              <input
                type="date"
                className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
                value={value.start || ""}
                onChange={(e) => updateCondition(condition.id, "value", { ...value, start: e.target.value })}
              />
              <span>and</span>
              <input
                type="date"
                className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
                value={value.end || ""}
                onChange={(e) => updateCondition(condition.id, "value", { ...value, end: e.target.value })}
              />
            </div>
          )
        } else {
          return (
            <input
              type="date"
              className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
              value={value || ""}
              onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
            />
          )
        }

      case "MERCHANT":
        if (operator === "IN" || operator === "NOT_IN") {
          return (
            <div className="space-y-2">
              {Array.isArray(value)
                ? value.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all flex-1"
                        placeholder="Merchant name"
                        value={item || ""}
                        onChange={(e) => {
                          const newValue = [...value]
                          newValue[index] = e.target.value
                          updateCondition(condition.id, "value", newValue)
                        }}
                      />
                      <button
                        type="button"
                        className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                        onClick={() => {
                          const newValue = [...value]
                          newValue.splice(index, 1)
                          updateCondition(condition.id, "value", newValue)
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                : null}
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700 transition-colors text-sm flex items-center"
                onClick={() => {
                  const newValue = Array.isArray(value) ? [...value, ""] : [""]
                  updateCondition(condition.id, "value", newValue)
                }}
              >
                <span className="mr-1">+</span> Add merchant
              </button>
            </div>
          )
        } else {
          return (
            <input
              type="text"
              className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
              placeholder="Merchant name"
              value={value || ""}
              onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
            />
          )
        }

      default:
        return (
          <input
            type="text"
            className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
            placeholder="Value"
            value={value || ""}
            onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
          />
        )
    }
  }

  // Render action configuration based on action type
  const renderActionConfig = (action) => {
    const { type, config } = action

    if (!type) return null

    switch (type) {
      case "BLOCK":
        return null // No additional config needed

      case "NOTIFY":
        return (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notify User</label>
              <select
                className="form-select rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all w-full"
                value={config.notifyUser || ""}
                onChange={(e) => updateAction(action.id, "config.notifyUser", e.target.value)}
              >
                <option value="">Select User</option>
                {familyMembers.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notification Message</label>
              <textarea
                className="form-textarea rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all w-full"
                placeholder="Enter notification message"
                value={config.message || ""}
                onChange={(e) => updateAction(action.id, "config.message", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )

      case "REQUIRE_APPROVAL":
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Approver</label>
            <select
              className="form-select rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all w-full"
              value={config.approver || ""}
              onChange={(e) => updateAction(action.id, "config.approver", e.target.value)}
            >
              <option value="">Select Approver</option>
              {familyMembers.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>
        )

      case "LIMIT_AMOUNT":
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Amount</label>
            <input
              type="number"
              className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all w-full"
              placeholder="Enter maximum amount"
              value={config.maxAmount || ""}
              onChange={(e) => updateAction(action.id, "config.maxAmount", e.target.value)}
            />
          </div>
        )

      case "CUSTOM":
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Configuration (JSON)</label>
            <textarea
              className="form-textarea rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all w-full font-mono text-sm"
              placeholder='{"key": "value"}'
              value={config.customConfig || ""}
              onChange={(e) => updateAction(action.id, "config.customConfig", e.target.value)}
              rows={4}
            />
          </div>
        )

      default:
        return null
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({
      ruleName,
      ruleType,
      ruleDescription,
      familyMember,
      isActive,
      conditions,
      actions,
    })

    // Show success toast
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Get action icon
  const getActionIcon = (type) => {
    switch (type) {
      case "BLOCK":
        return "🛑"
      case "NOTIFY":
        return "🔔"
      case "REQUIRE_APPROVAL":
        return "📩"
      case "LIMIT_AMOUNT":
        return "💰"
      case "CUSTOM":
        return "⚙️"
      default:
        return "📋"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-blue-700">Create Spending Rule</h1>
          <p className="text-gray-600 mt-2">Define restrictions and behaviors for a family member's transactions.</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Basic Rule Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-blue-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all w-full"
                  placeholder="Enter rule name"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="form-select rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all w-full"
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value)}
                >
                  <option value="">Select Rule Type</option>
                  {ruleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Description</label>
                <textarea
                  className="form-textarea rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all w-full"
                  placeholder="Enter rule description (optional)"
                  rows={3}
                  value={ruleDescription}
                  onChange={(e) => setRuleDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Family Member <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="form-select rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all w-full"
                  value={familyMember}
                  onChange={(e) => setFamilyMember(e.target.value)}
                >
                  <option value="">Select Family Member</option>
                  {familyMembers.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isActive}
                      onChange={() => setIsActive(!isActive)}
                    />
                    <div
                      className={`block w-14 h-8 rounded-full transition-colors duration-300 ${isActive ? "bg-blue-400" : "bg-gray-300"}`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${isActive ? "transform translate-x-6" : ""}`}
                    ></div>
                  </div>
                  <div className="ml-3 text-sm font-medium text-gray-700">{isActive ? "Active" : "Inactive"}</div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Rule Conditions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-blue-100"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Set Conditions</h2>

            <AnimatePresence>
              {conditions.map((condition, index) => (
                <motion.div
                  key={condition.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100"
                >
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    onClick={() => removeCondition(condition.id)}
                    disabled={conditions.length === 1}
                  >
                    ✕
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Condition Type</label>
                      <select
                        className="form-select rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all w-full"
                        value={condition.type}
                        onChange={(e) => updateCondition(condition.id, "type", e.target.value)}
                      >
                        <option value="">Select Type</option>
                        {conditionTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {condition.type && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                        <select
                          className="form-select rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all w-full"
                          value={condition.operator}
                          onChange={(e) => updateCondition(condition.id, "operator", e.target.value)}
                        >
                          <option value="">Select Operator</option>
                          {getOperators(condition.type).map((op) => (
                            <option key={op} value={op}>
                              {op}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {condition.type && condition.operator && (
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                        {renderValueInput(condition)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="mt-2 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              onClick={addCondition}
            >
              <span className="mr-1 text-lg">+</span> Add Condition
            </motion.button>
          </motion.div>

          {/* Rule Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-blue-100"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Define Actions</h2>

            <AnimatePresence>
              {actions.map((action) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100"
                >
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    onClick={() => removeAction(action.id)}
                    disabled={actions.length === 1}
                  >
                    ✕
                  </button>

                  <div>
                    <div className="flex items-center mb-4">
                      {action.type && <span className="mr-2 text-xl">{getActionIcon(action.type)}</span>}
                      <label className="block text-sm font-medium text-gray-700">Action Type</label>
                    </div>
                    <select
                      className="form-select rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all w-full"
                      value={action.type}
                      onChange={(e) => updateAction(action.id, "type", e.target.value)}
                    >
                      <option value="">Select Action Type</option>
                      {actionTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.replace("_", " ")}
                        </option>
                      ))}
                    </select>

                    {renderActionConfig(action)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="mt-2 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              onClick={addAction}
            >
              <span className="mr-1 text-lg">+</span> Add Action
            </motion.button>
          </motion.div>

          {/* Form Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-end gap-4 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <span>Save Rule</span>
            </motion.button>
          </motion.div>
        </form>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Rule saved successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RulesPage
