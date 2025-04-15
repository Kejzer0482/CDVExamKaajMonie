import xarray as xr
import pandas as pd

#Load data
ds = xr.open_dataset("sst.mnmean.nc")

#Kig på variable for at forstå datastrukturen
print(ds)

#Prøv først uden filter — hvad er shape, min/max?
print(ds['sst'])

#Vadehavet
sst_vadehavet = ds['sst'].sel(lat=slice(55.5, 54.5), lon=slice(8, 9))
print("Subset (Vadehavet):", sst_vadehavet)

#Drop NaNs og gem nogle prøvedata
sst_df = sst_vadehavet.mean(dim=["lat", "lon"], skipna=True).to_dataframe().dropna()

#Hent år og grupér
sst_df["year"] = sst_df.index.year
sst_annual = sst_df.groupby("year").mean().reset_index()

#Tilføj fiktivt år
sst_2035 = pd.DataFrame({
    "year": [2035],
    "sst": [sst_annual["sst"].mean() + 0.5]
})
sst_annual = pd.concat([sst_annual, sst_2035], ignore_index=True)

#Gem fil
sst_annual.to_csv("sst_vadehavet.csv", index=False)
print("✅ Gemte sst_vadehavet.csv med:", len(sst_annual), "rækker")