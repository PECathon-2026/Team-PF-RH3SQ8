import { Scenario } from "@/types/guild";

export const PRESET_SCENARIOS: Scenario[] = [
  {
    id: "auth-null",
    name: "1. Auth Null Pointer Crash",
    filename: "auth_service.py",
    badge: "Null Pointer & Bounds",
    decree: "Fix login authentication null pointer crash, enforce string length bounds, and isolate session token in auth_service.py",
    brokenCode: `def login(user, password):
    # BUG: Crashes on None, integer, or non-string inputs
    # BUG: Empty whitespace strings pass authentication
    token = user.strip() + ":" + password.strip()
    return {"status": "ok", "token": token}`,
    initialPatch: `def login(user, password):
    # Iteration 1: Basic null check added
    if not user:
        raise ValueError("Username is required")
    # Edge-case bug: empty strings or non-string passwords still cause crash
    token = f"{user.strip()}:{password.strip()}"
    return {"status": "ok", "token": token}`,
    healedPatch: `def login(user, password):
    # Iteration 2 (Self-Healed): Strict type enforcement and empty-string guards
    if not user or not isinstance(user, str) or len(user.strip()) == 0:
        raise ValueError("Valid non-empty username is required")
    if not password or not isinstance(password, str) or len(password.strip()) == 0:
        raise ValueError("Password cannot be null or empty string")

    # Cryptographically isolated credentials
    safe_user = user.strip()
    safe_token = f"tok_sec_{abs(hash(safe_user + password))}"
    return {"status": "ok", "token": safe_token, "user": safe_user}`,
    edgeCaseTrace: "AssertionError: Edge-case input password='' failed validation on auth_service.py:line 4. Expected ValueError on empty string, got unhandled exception.",
  },
  {
    id: "billing-div-zero",
    name: "2. Billing ZeroDivision Crash",
    filename: "billing_engine.py",
    badge: "Division by Zero & Float Clamp",
    decree: "Patch ZeroDivisionError when items count is zero, clamp negative discount percentages, and round currency in billing_engine.py",
    brokenCode: `def calculate_invoice(subtotal, discount_percent, items_count):
    # BUG: items_count == 0 causes unhandled ZeroDivisionError
    # BUG: Negative discount_percent results in inflated billing
    discount = subtotal * (discount_percent / 100.0)
    final_total = subtotal - discount
    cost_per_item = final_total / items_count
    return {"total": final_total, "cost_per_item": cost_per_item}`,
    initialPatch: `def calculate_invoice(subtotal, discount_percent, items_count):
    # Iteration 1: Computes discount with basic validation
    discount = subtotal * (discount_percent / 100.0)
    final_total = subtotal - discount
    # Edge-case bug: items_count == 0 still causes ZeroDivisionError
    cost_per_item = final_total / items_count
    return {"total": final_total, "cost_per_item": cost_per_item}`,
    healedPatch: `def calculate_invoice(subtotal, discount_percent, items_count):
    # Iteration 2 (Self-Healed): Non-negative bounds & zero-item protection
    if subtotal < 0:
        raise ValueError("Subtotal cannot be negative")
    clamped_discount = max(0.0, min(100.0, float(discount_percent)))
    discount_amount = round(subtotal * (clamped_discount / 100.0), 2)
    final_total = max(0.0, round(subtotal - discount_amount, 2))

    # Guard against ZeroDivisionError when items_count is zero
    cost_per_item = round(final_total / items_count, 2) if items_count > 0 else 0.0
    return {"total": final_total, "discount": discount_amount, "cost_per_item": cost_per_item}`,
    edgeCaseTrace: "ZeroDivisionError: division by zero on billing_engine.py:line 7 when items_count=0. Expected safe fallback 0.0, got unhandled crash.",
  },
  {
    id: "db-secret-leak",
    name: "3. Hardcoded Secret & KMS Migration",
    filename: "database_vault.py",
    badge: "Security & Secret Leakage",
    decree: "Eliminate plain-text root database credentials, enforce KMS secret manager retrieval, and enable SSL in database_vault.py",
    brokenCode: `import os

# VULNERABILITY: Plaintext hardcoded root password exposed in code repository
DB_USER = "mikado_admin"
DB_PASSWORD = "super_secret_production_password_do_not_share!"
DB_HOST = "prod-db.internal.sanctuary.net"

def get_db_connection():
    return connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD)`,
    initialPatch: `import os

# Iteration 1: Fallback environment variable with exposed default secret
DB_USER = os.getenv("DB_USER", "mikado_admin")
DB_PASSWORD = os.getenv("DB_PASSWORD", "super_secret_production_password_do_not_share!")
DB_HOST = os.getenv("DB_HOST", "prod-db.internal.sanctuary.net")

def get_db_connection():
    return connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD)`,
    healedPatch: `import os
from secrets_manager import get_vault_secret

# Iteration 2 (Self-Healed): Zero hardcoded secrets, authenticated KMS vault resolution
def get_db_connection():
    db_host = os.environ.get("DB_HOST", "db.cluster.internal")
    db_user = os.environ.get("DB_USER", "mikado_service_account")
    db_password = get_vault_secret("prod/database/master_key")
    if not db_password:
        raise RuntimeError("Database credentials missing from secure KMS vault")
    return connect(host=db_host, user=db_user, password=db_password, ssl_mode="require")`,
    edgeCaseTrace: "SecurityAuditFailure: Hardcoded fallback secret detected in AST scan on database_vault.py:line 5. Secret exposure risk: HIGH.",
  },
];

