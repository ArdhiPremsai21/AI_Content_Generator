"use client";
import React, { useContext, useState } from 'react'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Templates from '@/app/(data)/Templates'
import { ArrowLeft} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import moment from 'moment';
import { chatSession } from '@/utils/AiModal'
import { db } from '@/utils/db'
import { AIOutput } from '@/utils/schema'
import { useUser } from '@clerk/clerk-react'
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';


interface PROPS{
    params:{
        'template-slug':string
    }
    slug:string
}


function CreateNewContent(props: PROPS) {
    const selectedTemplate: TEMPLATE | undefined = Templates?.find((item) => item.slug == props.params['template-slug']);
    const [loading, setLoading] = useState(false);
    const [aiOutput, setAioutput] = useState<string>('');
    const { user } = useUser();
    const router = useRouter(); // Using useRouter in client-side context
    const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);



    const GenerateAIContent = async (formData: any) => {
        if (totalUsage >= 10000) {
            console.log("Please Upgrade");
            router.push('/dashboard/billing'); // Ensure router is available
            return;
        }
        setLoading(true);
        const SelectedPrompt = selectedTemplate?.aiPrompt;

        const FinalAIPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;

        const result = await chatSession.sendMessage(FinalAIPrompt);
        console.log(result.response.text());
        setAioutput(result?.response.text());
        await SaveInDb(formData, selectedTemplate?.slug, result?.response.text());
        setLoading(false);
    };

    const SaveInDb = async (formData: any, slug: any, aiResp: string) => {
        const result = await db.insert(AIOutput).values({
            formData: formData,
            templateSlug: slug,
            aiResponse: aiResp,
            createdBy: user?.primaryEmailAddress?.emailAddress || '',
            createdAt: moment().format('DD/MM/yyyy'),
        });
        console.log(result);
    };

    return (
        <div className='p-10'>
            <Link href={'/dashboard'}>
                <Button><ArrowLeft />Back</Button>
            </Link>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 py-5'>
                {/* FormSection */}
                <FormSection
                    selectedTemplate={selectedTemplate}
                    userFormInput={(v: any) => GenerateAIContent(v)}
                    loading={loading}
                />
                {/* OutputSection */}
                <div className='col-span-2'>
                    <OutputSection aiOutput={aiOutput} />
                </div>
            </div>
        </div>
    );
}

export default CreateNewContent;

