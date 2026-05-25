import React, { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import LegalContentEditor from '../../../components/cms/LegalContentEditor';
import { cmsService } from '../../../services/cmsService';
import { homepageService } from '../../../services/homepageService';
import { prepareLegalHtml } from '../../../utils/legalContent';
import { getStoryPhotoUrl, formatStoryDate } from '../../../utils/storyMedia';
import SiteContactSettingsForm from './SiteContactSettingsForm';

const HomepageCmsTab = () => {
  const [tab, setTab] = useState('news');
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [stories, setStories] = useState([]);
  const [newsForm, setNewsForm] = useState({ title: '', excerpt: '', blogUrl: '', imageUrl: '', category: '', isPublished: true });
  const [videoForm, setVideoForm] = useState({ title: '', description: '', youtubeUrl: '', isPublished: true });
  const [legalSlug, setLegalSlug] = useState('privacy-policy');
  const [legalForm, setLegalForm] = useState({ title: '', bodyHtml: '' });

  const load = async () => {
    const [n, v, s] = await Promise.all([
      cmsService.news.list(),
      cmsService.videos.list(),
      cmsService.stories.list('pending'),
    ]);
    setNews(n); setVideos(v); setStories(s);
  };

  const loadLegal = async (slug) => {
    const page = await homepageService.getLegalPage(slug);
    setLegalForm({ title: page.title, bodyHtml: page.bodyHtml || '' });
    setLegalSlug(slug);
  };

  useEffect(() => { load().catch(console.error); loadLegal('privacy-policy').catch(() => {}); }, []);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {['contact', 'news', 'videos', 'stories', 'legal'].map((t) => (
          <Button key={t} variant={tab === t ? 'default' : 'outline'} size="sm" onClick={() => setTab(t)}>{t}</Button>
        ))}
      </div>
      {tab === 'contact' && <SiteContactSettingsForm />}
      {tab === 'news' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 border rounded-lg p-4">
            <h3 className="font-semibold">Add news / blog</h3>
            <Input label="Title" value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} />
            <Input label="Excerpt" value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} />
            <Input label="Blog URL" value={newsForm.blogUrl} onChange={(e) => setNewsForm({ ...newsForm, blogUrl: e.target.value })} />
            <Input label="Image URL" value={newsForm.imageUrl} onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })} />
            <Button onClick={() => cmsService.news.create(newsForm).then(load)}>Save</Button>
          </div>
          <ul className="space-y-2 max-h-96 overflow-auto">{news.map((item) => (
            <li key={item.id} className="border p-3 rounded flex justify-between"><span>{item.title}</span>
            <Button size="sm" variant="outline" onClick={() => cmsService.news.remove(item.id).then(load)}>Delete</Button></li>
          ))}</ul>
        </div>
      )}
      {tab === 'videos' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 border rounded-lg p-4">
            <h3 className="font-semibold">Add YouTube video</h3>
            <Input label="Title" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} />
            <Input label="YouTube URL" value={videoForm.youtubeUrl} onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })} />
            <Input label="Description" value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} />
            <Button onClick={() => cmsService.videos.create(videoForm).then(load)}>Save</Button>
          </div>
          <ul className="space-y-2 max-h-96 overflow-auto">{videos.map((item) => (
            <li key={item.id} className="border p-3 rounded flex justify-between"><span>{item.title}</span>
            <Button size="sm" variant="outline" onClick={() => cmsService.videos.remove(item.id).then(load)}>Delete</Button></li>
          ))}</ul>
        </div>
      )}
      {tab === 'stories' && (
        <ul className="space-y-4">
          {stories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No pending stories.</p>
          )}
          {stories.map((s) => {
            const photoSrc = getStoryPhotoUrl(s.photo_url);
            return (
              <li key={s.id} className="border border-border rounded-xl p-5 bg-card shadow-sm">
                <div className="flex flex-col lg:flex-row gap-5">
                  {photoSrc && (
                    <div className="flex-shrink-0">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Submitted photo</p>
                      <a href={photoSrc} target="_blank" rel="noopener noreferrer" className="block">
                        <img
                          src={photoSrc}
                          alt={`Photo from ${s.submitter_name}`}
                          className="w-full max-w-[220px] rounded-lg border border-border object-cover max-h-56"
                        />
                      </a>
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{s.submitter_name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted {formatStoryDate(s.created_at)}
                        {s.story_type && (
                          <span className="ml-2 capitalize inline-flex px-2 py-0.5 rounded-full bg-muted">
                            {s.story_type}
                          </span>
                        )}
                      </p>
                    </div>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Email</dt>
                        <dd className="font-medium break-all">
                          <a href={`mailto:${s.submitter_email}`} className="text-primary hover:underline">
                            {s.submitter_email || '—'}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd className="font-medium">
                          {s.submitter_phone ? (
                            <a href={`tel:${s.submitter_phone}`} className="text-primary hover:underline">
                              {s.submitter_phone}
                            </a>
                          ) : (
                            '—'
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Location</dt>
                        <dd className="font-medium">{s.location || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Loan amount</dt>
                        <dd className="font-medium">{s.loan_amount || '—'}</dd>
                      </div>
                    </dl>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Story</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap rounded-lg bg-muted/50 p-3 border border-border">
                        {s.story_text}
                      </p>
                    </div>
                    {!photoSrc && (
                      <p className="text-xs text-muted-foreground italic">No photo submitted</p>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button size="sm" onClick={() => cmsService.stories.moderate(s.id, { action: 'approve' }).then(load)}>
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const reason = window.prompt('Rejection reason (optional):', 'Not suitable for publication');
                          if (reason === null) return;
                          cmsService.stories.moderate(s.id, { action: 'reject', rejectionReason: reason || 'Not suitable' }).then(load);
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {tab === 'legal' && (
        <div className="space-y-4 max-w-3xl">
          <select className="border rounded px-3 py-2" value={legalSlug} onChange={(e) => loadLegal(e.target.value)}>
            {['privacy-policy','terms-of-service','help-center','financial-guides','careers','cookie-policy'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Input label="Title" value={legalForm.title} onChange={(e) => setLegalForm({ ...legalForm, title: e.target.value })} />
          <LegalContentEditor
            label="Page content (paragraphs, headings, lists)"
            value={legalForm.bodyHtml}
            onChange={(bodyHtml) => setLegalForm({ ...legalForm, bodyHtml })}
          />
          <Button
            onClick={() =>
              cmsService.legal.update(legalSlug, {
                title: legalForm.title,
                bodyHtml: prepareLegalHtml(legalForm.bodyHtml),
              }).then(() => loadLegal(legalSlug))
            }
          >
            Save legal page
          </Button>
        </div>
      )}
    </div>
  );
};
export default HomepageCmsTab;
