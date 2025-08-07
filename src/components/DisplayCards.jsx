import React, { useState, useEffect, useRef } from "react";
import { totpAPI } from "../services/api";
import Card from "./Card";
import { SkeletonCard } from "./Skeleton";
import "../styles/components/DisplayCards.css";

export default function DisplayCards({ enteredPin }) {
  const [accounts, setAccounts] = useState([]);
  const [currentCodes, setCurrentCodes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const accountsRef = useRef([]);

  // Fetch accounts and current TOTP codes
  useEffect(() => {
    const fetchData = async () => {
      if (!enteredPin) return;

      try {
        setIsLoading(true);
        setError("");

        // Fetch accounts first
        let accountsData = [];
        try {
          accountsData = await totpAPI.getAccounts(enteredPin);
          console.log("Fetched accounts:", accountsData);

          setAccounts(accountsData);
          accountsRef.current = accountsData; // Update ref
        } catch (accountsError) {
          // If accounts fetch fails with 404, it means no tokens exist
          if (
            accountsError.message &&
            (accountsError.message.includes("404") ||
              accountsError.message.includes("Not Found") ||
              accountsError.message.includes("No accounts found"))
          ) {
            setAccounts([]);
            setCurrentCodes({});
            setIsLoading(false);
            return; // Don't try to fetch codes if no accounts
          } else {
            throw accountsError; // Re-throw other errors
          }
        }

        // Only fetch codes if we have accounts
        if (accountsData.length > 0) {
          try {
            const codesData = await totpAPI.getCurrentCodes(enteredPin);

            // Convert codes array to key-value mapping
            if (Array.isArray(codesData)) {
              const codesMap = {};
              codesData.forEach((codeData) => {
                // Try multiple key formats to match with account keys
                const key1 = `${codeData.issuer}-${codeData.nickname}`;
                const key2 = codeData.key;
                const key3 = `${codeData.issuer} (${codeData.nickname})`;

                codesMap[key1] = codeData.code;
                codesMap[key2] = codeData.code;
                codesMap[key3] = codeData.code;
              });
              setCurrentCodes(codesMap);
            } else {
              setCurrentCodes(codesData);
            }
          } catch (codesError) {
            // If codes fetch fails, just show accounts without codes
            console.warn("Failed to fetch TOTP codes:", codesError);
            setCurrentCodes({});
          }
        } else {
          setCurrentCodes({});
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load accounts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up interval to refresh TOTP codes every 30 seconds
    const interval = setInterval(async () => {
      // Only refresh codes if we have accounts
      if (accountsRef.current.length === 0) return;

      try {
        const codesData = await totpAPI.getCurrentCodes(enteredPin);

        // Convert codes array to key-value mapping
        if (Array.isArray(codesData)) {
          const codesMap = {};
          codesData.forEach((codeData) => {
            // Try multiple key formats to match with account keys
            const key1 = `${codeData.issuer}-${codeData.nickname}`;
            const key2 = codeData.key;
            const key3 = `${codeData.issuer} (${codeData.nickname})`;

            codesMap[key1] = codeData.code;
            codesMap[key2] = codeData.code;
            codesMap[key3] = codeData.code;
          });
          setCurrentCodes(codesMap);
        } else {
          setCurrentCodes(codesData);
        }
      } catch (err) {
        // Handle 404 errors gracefully during refresh
        if (
          err.message &&
          (err.message.includes("404") || err.message.includes("Not Found"))
        ) {
          console.log("No codes available during refresh");
          setCurrentCodes({});
        } else {
          console.error("Failed to refresh TOTP codes:", err);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [enteredPin]);

  // Function to remove an account
  const handleRemoveAccount = async (issuer, nickname) => {
    try {
      await totpAPI.removeAccount(issuer, nickname);
      const accountsData = await totpAPI.getAccounts(enteredPin);

      setAccounts(accountsData);
    } catch (err) {
      setError(err.message || "Failed to remove account");
    }
  };

  if (isLoading) {
    return (
      <div className="display-cards">
        <SkeletonCard count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="display-cards">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="display-cards">
        <div className="no-accounts-message">
          <div className="no-accounts-icon">
            <i className="ri-add-circle-line"></i>
          </div>
          <h3>No 2FA Tokens Yet</h3>
          <p>You haven't added any 2FA tokens to your account yet.</p>
          <p>Get started by adding your first token!</p>
          <a href="/add-token" className="add-token-btn">
            <i className="ri-add-line"></i>
            Add Your First Token
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="display-cards">
      {accounts.map((account, index) => {
        const accountKey = `${account.issuer}-${account.nickname}`;
        console.log("Current account:", account);
        const totpCode = currentCodes[accountKey] || "Loading...";

        return (
          <Card
            key={`${account.issuer}-${account.nickname}-${index}`}
            icon={account.logoUrl || "🔐"}
            account={account.issuer}
            name={account.nickname}
            totp={totpCode}
            onRemove={() =>
              handleRemoveAccount(account.issuer, account.nickname)
            }
          />
        );
      })}
    </div>
  );
}