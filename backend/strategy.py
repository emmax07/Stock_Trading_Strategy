import yfinance as yf
import pandas as pd
import numpy as np
import json

def compute_strategy(symbol="AAPL", start="2020-01-01", end="2025-05-31", capital=10000):
    data = yf.download(symbol, start=start, end=end)

    data['Return'] = data['Close'].pct_change()
    data['MA10'] = data['Close'].rolling(10).mean()
    data['MA50'] = data['Close'].rolling(50).mean()
    data['Signal'] = 0
    data.loc[data['MA10'] > data['MA50'], 'Signal'] = 1
    data.loc[data['MA10'] < data['MA50'], 'Signal'] = -1
    data['Position'] = data['Signal'].shift(1)
    data['Strategy_Return'] = data['Position'] * data['Return']
    data['Equity_Curve'] = (1 + data['Strategy_Return']).cumprod() * capital
    data['Market_Curve'] = (1 + data['Return']).cumprod() * capital

    data['Price'] = data['Close']

    # Round all float columns to 2 decimals
    float_cols = ['Price', 'Close', 'High', 'Low', 'Open', 'Return', 'MA10', 'MA50', 'Signal', 'Position', 'Strategy_Return', 'Equity_Curve', 'Market_Curve']
    for col in float_cols:
        if col in data.columns:
            data[col] = data[col].round(2)

    # Convert Volume to int 
    if 'Volume' in data.columns:
        data['Volume'] = data['Volume'].astype('int64')

    # Save with 2 decimals formatting
    data.to_csv("strategy_results.csv", float_format='%.3f')

    metrics = {
        "Total Return": f"{(data['Equity_Curve'].iloc[-1] / capital - 1):.2%}",
        "Win Rate": f"{(data['Strategy_Return'] > 0).sum() / len(data):.2%}"
    }

    with open("performance_metrics.json", "w") as f:
        json.dump(metrics, f)

if __name__ == "__main__":
    compute_strategy()
