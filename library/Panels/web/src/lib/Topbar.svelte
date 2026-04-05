<script lang="ts">
  import Panels from "$lib/Panels.svelte"
  import { Button, Overlay, TextInput } from "ftc-panels"
  import { global } from "$lib"
  import { goto } from "$app/navigation"
  import Navlets from "./navlets/Navlets.svelte"

  import Options from "./icons/Options.svelte"

  import { getContext } from "svelte"
  import type { Manager } from "./grid/widgets.svelte"
  import TemplatesChoose from "./grid/TemplatesChoose.svelte"
  import Delete from "./icons/Delete.svelte"
  import Add from "./icons/Add.svelte"
  import Copy from "./icons/Copy.svelte"
  import Plugins from "./icons/Plugins.svelte"
  import Docs from "./icons/Docs.svelte"
  import Presets from "./icons/Presets.svelte"
  import Bell from "./icons/Bell.svelte"
  import AllNotifications from "./AllNotifications.svelte"
  const manager = getContext("manager") as Manager

  let jsonPreset = $state("")

  import { getFirstPlugin } from "ftc-panels-docs"

  const first = getFirstPlugin(global.plugins.map((it) => it.details))

  const url = first ? `/docs/${first}` : "/docs"
</script>

<nav>
  <a href="/">
    <Panels />
  </a>

  <p>
    <span class="status-dot"></span>
    {global.isPrepared ? "Connected" : "Waiting"}
  </p>

  {#if global.isPrepared}
    <Navlets {manager} />
  {:else}
    <section style="flex-grow: 1;"></section>
  {/if}

  <Overlay
    triggerStyle={"display: flex;justify-content: center;align-items: center;"}
  >
    {#snippet trigger({ isOpen })}
      <Bell />
    {/snippet}
    {#snippet overlay()}
      <div class="bell-menu">
        <h1>Notifications</h1>

        {#each global.notifications}
          <AllNotifications />
        {:else}
          <p>No notifications</p>
        {/each}
      </div>
    {/snippet}
  </Overlay>

  <a href={url}>
    <Docs />
  </a>

  <Overlay
    triggerStyle={"display: flex;justify-content: center;align-items: center;"}
  >
    {#snippet trigger({ isOpen })}
      <Presets />
    {/snippet}
    {#snippet overlay({ close }: { close: () => void })}
      <div class="presets-overlay">
        <h1>Presets</h1>
        {#each manager.presets.data as preset, index}
          <div class="preset">
            <Button
              selected={manager.presets.selected === index}
              onclick={() => {
                manager.change(index)
              }}
            >
              {preset.name}
            </Button>
            <Overlay>
              {#snippet trigger()}
                <Options />
              {/snippet}
              {#snippet overlay({ close }: { close: () => void })}
                <div class="menu">
                  <TextInput
                    bind:value={manager.presets.data[index].name}
                    oninput={() => {
                      manager.save()
                    }}
                  />
                  <Button
                    transparent={true}
                    disabled={manager.presets.data.length === 1}
                    onclick={() => {
                      manager.deletePreset(index)
                      close()
                    }}
                  >
                    <Delete />
                  </Button>
                  <Button
                    transparent={true}
                    onclick={() => {
                      manager.save()
                      const temp = manager.unprocessTemplate(
                        manager.presets.data[index]
                      )
                      close()
                      global.notificationsManager.addAction(
                        JSON.stringify(temp),
                        [
                          {
                            text: "Copy",
                            task: () => {
                              navigator.clipboard
                                .writeText(JSON.stringify(temp))
                                .then(() => {
                                  global.notificationsManager.add(
                                    "Text copied to clipboard"
                                  )
                                })
                                .catch((err) => {
                                  global.notificationsManager.add(
                                    "Failed to copy"
                                  )
                                })
                            },
                          },
                          {
                            text: "Close",
                            task: () => {},
                          },
                        ]
                      )
                    }}
                  >
                    <Copy />
                  </Button>
                </div>
              {/snippet}
            </Overlay>
          </div>
        {/each}
        <TemplatesChoose
          set={(t) => {
            manager.addTemplate(t)
            close()
          }}
        />
        <Overlay
          onStateChange={(isOpen) => {
            if (isOpen) {
              jsonPreset = ""
            }
          }}
        >
          {#snippet trigger()}
            <Button style="width: 100%;">Import</Button>
          {/snippet}
          {#snippet overlay({ close }: { close: () => void })}
            <div class="new-menu">
              <TextInput bind:value={jsonPreset} placeholder={"JSON Preset"} />
              <Button
                style="width: 100%;"
                onclick={() => {
                  manager.addTemplate(JSON.parse(jsonPreset))
                  close()
                }}>Create</Button
              >
            </div>
          {/snippet}
        </Overlay>
        <Button
          onclick={() => {
            manager.newPreset()
            close()
          }}
        >
          <Add />
        </Button>
      </div>
    {/snippet}
  </Overlay>

  <Overlay
    triggerStyle={"display: flex;justify-content: center;align-items: center;"}
  >
    {#snippet trigger({ isOpen })}
      <Plugins />
    {/snippet}
    {#snippet overlay({ close }: { close: () => void })}
      <div class="plugins-overlay">
        <h1>Plugins</h1>

        <div class="grid">
          {#each global.plugins as plugin}
            <button
              class="plugin"
              onclick={() => {
                goto(`/plugins/${plugin.details.id}`)
                close()
              }}
            >
              {plugin.details.letterName}
            </button>
          {/each}
          {#each global.skippedPlugins as details}
            <button class="plugin" disabled onclick={close}>
              {details.letterName}
            </button>
          {/each}
        </div>

        <Button
          style="margin-top: 0.5rem"
          onclick={() => {
            goto("/plugins")
            close()
          }}>Details</Button
        >
      </div>
    {/snippet}
  </Overlay>
</nav>

<style>
  h1 {
    margin: 0;
    margin-bottom: var(--space-2);
    font-size: clamp(1.15rem, 0.45vw + 1rem, 1.5rem);
  }
  p {
    margin: 0;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    white-space: nowrap;
    opacity: 0.88;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .status-dot {
    width: 0.58rem;
    height: 0.58rem;
    border-radius: 50%;
    background-color: var(--primary);
    box-shadow: 0 0 0 0.15rem rgba(230, 0, 18, 0.35);
    box-shadow: 0 0 0 0.15rem color-mix(in srgb, var(--primary) 35%, transparent);
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  .plugins-overlay {
    min-width: min(300px, calc(100vw - 2rem));
    min-height: 130px;
    max-height: min(70vh, 480px);

    overflow-y: auto;

    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid #505151;
  }
  .presets-overlay {
    min-width: min(360px, calc(100vw - 2rem));
    min-height: 160px;
    max-height: min(76vh, 560px);

    overflow-y: auto;

    display: flex;
    flex-direction: column;

    padding: var(--space-3);
    gap: var(--space-2);
    border-radius: var(--radius-md);
    border: 1px solid #505151;
  }
  .preset {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  .menu {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2);
    max-height: 600px;
    border-radius: var(--radius-sm);
  }

  .new-menu {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
    padding: var(--space-2);
    max-height: 600px;
    min-width: min(400px, calc(100vw - 3rem));
    border-radius: var(--radius-sm);
  }

  .bell-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3);
    max-height: 800px;
    min-width: min(340px, calc(100vw - 2rem));
    max-width: 460px;
    border-radius: var(--radius-md);
    border: 1px solid #505151;
  }
  .grid {
    margin-top: var(--space-2);

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(42px, auto));
    gap: var(--space-2);
  }

  button.plugin {
    background-color: transparent;
    color: inherit;
    margin: 0;
    border: 1px solid var(--bgLight);
    padding: var(--space-1);
    border-radius: 69vw;
    width: 42px;
    height: 42px;
    display: grid;
    place-content: center;
    cursor: pointer;
  }
  button.plugin:hover:not(:disabled) {
    border-color: #6b6b6b;
    background-color: #4a4b4b;
    border-color: color-mix(in srgb, var(--primary) 35%, var(--bgLight));
    background-color: color-mix(in srgb, var(--bgLight) 85%, white 15%);
  }
  nav {
    background-color: var(--bgMedium);
    padding: 0 var(--space-3);

    display: flex;
    justify-content: space-between;
    align-items: center;

    border-radius: var(--radius-lg);
    margin: 0;

    gap: var(--space-3);
    max-width: 100%;

    overflow-x: auto;
    overflow-y: hidden;
    max-height: 74px;
    min-height: 74px;
    border: 1px solid #505151;
    border: 1px solid color-mix(in srgb, var(--bgLight) 85%, white 15%);
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 1280px) {
    nav {
      min-height: 68px;
      max-height: 68px;
      padding: 0 var(--space-2);
      gap: var(--space-2);
    }
  }
</style>
